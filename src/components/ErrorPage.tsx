import { makeStyles } from "@mui/styles";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    margin: 0,
    marginBottom: 10,
  },
  homeBtn: {
    color: "black",
    textDecoration: "none",
  },
}));

const ErrorPage = () => {
  const { pathname } = useLocation();
  const styles = useStyles();
  return (
    <div className={styles.container}>
      {pathname === "/unauthorized" ? (
        <h3 className={styles.text}>
          You are not authorised to access this page
        </h3>
      ) : (
        <h3 className={styles.text}>404 | Not found</h3>
      )}
      <Link to="/" className={styles.homeBtn}>
        Back to <span style={{ color: "blue" }}>Home</span>
      </Link>
    </div>
  );
};

export default ErrorPage;
