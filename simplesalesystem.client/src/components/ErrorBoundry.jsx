import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // وقتی ارور میفته، state رو به روز می‌کنه
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // اینجا می‌تونی خطا و اطلاعاتش رو لاگ کنی
    console.error("Error caught in ErrorBoundary:", error);
    console.error("Error stack trace:", errorInfo.componentStack);

    // همچنین می‌تونی این داده‌ها رو به سرور بفرستی یا در state ذخیره کنی
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // نمایش صفحه خطا به کاربر
      return (
        <div>
          <h1>متاسفانه خطایی رخ داده است.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
