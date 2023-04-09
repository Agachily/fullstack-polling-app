import { Navigate} from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, child}) => {
    return isAuthenticated ? child : <Navigate to="/login"/>
};

export default PrivateRoute