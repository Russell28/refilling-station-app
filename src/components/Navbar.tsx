import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <nav style={{marginBottom: "20px"}}>
            <Link to="/" style={{ marginRight: "10px" }}>Dashboard</Link>
            <Link to="/daily-summary" style={{ marginRight: "10px" }}>Daily Summary</Link>
            <Link to="/trips" style={{ marginRight: "10px" }}>Trips</Link>
            <Link to="/debt-entries" style={{ marginRight: "10px" }}>Customer Debts</Link>
            <Link to="/expenses" style={{ marginRight: "10px" }}>Expenses</Link>
            <Link to="/payrolls" style={{ marginRight: "10px" }}>Payrolls</Link>
        </nav>
    );
}