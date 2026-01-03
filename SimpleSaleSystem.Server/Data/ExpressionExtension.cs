using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

namespace SimpleSaleSystem.Data
{
    /// <summary>
    /// Extension methods related to <see cref="Expression" />.
    /// </summary>
    public static class ExpressionExtensions
    {
        /// <summary>
        /// Renames all parameter names equal to <paramref name="oldParameterName" /> in
        /// <paramref name="expression" /> to <paramref name="newParameter" />.
        /// </summary>

        public static Expression ReplaceParameter([NotNull] this Expression expression,
            [NotNull] string oldParameterName,
            [NotNull] ParameterExpression newParameter)
        {
            ArgumentNullException.ThrowIfNull(expression);
            ArgumentNullException.ThrowIfNull(oldParameterName);
            ArgumentNullException.ThrowIfNull(newParameter);
            AlphaRenamingExpressionVisitor visitor = new(oldParameterName, newParameter);
            return visitor.Visit(expression);
        }

        /// <summary>
        /// Returns the conjunction of the two given predicate expressions, performing alpha renamings if necessary.
        /// </summary>
        public static Expression<Func<T, bool>> And<T>([NotNull] this Expression<Func<T, bool>> e1,
            [NotNull] Expression<Func<T, bool>> e2)
        {
            ArgumentNullException.ThrowIfNull(e1);
            ArgumentNullException.ThrowIfNull(e2);
            return BinaryOperation(e1, e2, Expression.AndAlso);
        }

        /// <summary>
        /// Returns the negation of the given predicate expression.
        /// </summary>
        public static Expression<Func<T, bool>> Not<T>([NotNull] this Expression<Func<T, bool>> e1)
        {
            ArgumentNullException.ThrowIfNull(e1);
            return Expression.Lambda<Func<T, bool>>(Expression.Not(e1.Body),
                e1.Parameters);
        }

        /// <summary>
        /// Returns the disjunction of the two given predicate expressions, performing alpha renamings if necessary.
        /// </summary>
        public static Expression<Func<T, bool>> Or<T>([NotNull] this Expression<Func<T, bool>> e1,
            [NotNull] Expression<Func<T, bool>> e2)
        {
            ArgumentNullException.ThrowIfNull(e1);
            ArgumentNullException.ThrowIfNull(e2);
            return BinaryOperation(e1, e2, Expression.OrElse);
        }

        //public static Expression<Func<TBase, bool>> CreateExpression<TBase, TFilter>(TBase baseClass, TFilter filterClass)
        //{
        //    ArgumentNullException.ThrowIfNull(baseClass);
        //    ArgumentNullException.ThrowIfNull(filterClass);

        //}
        
        private static Expression<Func<T, bool>> BinaryOperation<T>([NotNull] Expression<Func<T, bool>> e1,
            [NotNull] Expression<Func<T, bool>> e2, [NotNull] Func<Expression, Expression, Expression> binaryOp)
        {
            ArgumentNullException.ThrowIfNull(binaryOp);
            if (e1.Parameters[0].Equals(e2.Parameters[0]))
            {
                return Expression.Lambda<Func<T, bool>>(binaryOp(e1.Body, e2.Body), e1.Parameters[0]);
            }

            ParameterExpression newParam = Expression.Parameter(typeof(T), "x" + Guid.NewGuid().ToString("N"));

            Expression renamedBody1 = e1.Body.ReplaceParameter(e1.Parameters[0].Name, newParam);
            Expression renamedBody2 = e2.Body.ReplaceParameter(e2.Parameters[0].Name, newParam);
            return Expression.Lambda<Func<T, bool>>(binaryOp(renamedBody1, renamedBody2),
                newParam);
        }

        /// <summary>
        /// Initializes a new instance of <see cref="AlphaRenamingExpressionVisitor" /> with the given parameters.
        /// </summary>
        private class AlphaRenamingExpressionVisitor([NotNull] string oldParameterName,
            [NotNull] ParameterExpression newParameter) : ExpressionVisitor
        {
            [NotNull] private readonly string oldParameterName = oldParameterName ?? throw new ArgumentNullException(nameof(oldParameterName));
            [NotNull] private readonly ParameterExpression newParameter = newParameter ?? throw new ArgumentNullException(nameof(newParameter));

            /// <inheritdoc />
            protected override Expression VisitParameter([NotNull] ParameterExpression node)
            {
                ArgumentNullException.ThrowIfNull(node);

                return node.Name == oldParameterName ? newParameter : node;
            }
        }
    }
}
