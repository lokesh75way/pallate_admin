import { CircularProgress } from "@mui/material";

const LoadingComponent = ({ size }: { size?: number }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <CircularProgress size={size} />
    </div>
  );
};

export default LoadingComponent;
