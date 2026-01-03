import Row from "../../components/layout/Row";
import Col from "../../components/layout/Col";
import CardSalesToday from "./widgets/CardSalesToday";
import CardMyTasks from "./widgets/CardMyTasks";
import ChartSales from "./widgets/ChartSales";
import PieRequestsStatus from "./widgets/PieRequestsStatus";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Row mode="flex" justify="center" align="start">
        <Col span={12} responsive={{ sm: 6, md: 3 }} className="h-full">
          <CardSalesToday />
        </Col>
        <Col span={12} responsive={{ sm: 6, md: 4 }} className="h-full">
          <CardSalesToday />
        </Col>
        <Col span={12} responsive={{ sm: 6, md: 2 }} className="h-full">
          <CardSalesToday />
        </Col>
        <Col span={12} responsive={{ sm: 6, md: 3 }} className="h-full">
          <CardSalesToday />
        </Col>
        <Col span={12} responsive={{ sm: 6, md: 3 }} className="h-full">
          <CardMyTasks />
        </Col>
      </Row>
    </div>
  );
}
