import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <main className="unauthorized">
      <h2>Unauthorized</h2>
      <br />
      <p>You do not have access to the requested page.</p>
      <div>
        <button
          onClick={goBack}
          style={{
            display: "block",
            backgroundColor: "#82853e",
            color: "white",
            border: "none",
            outline: "none",
            padding: "7px",
            borderRadius: "3px",
            margin: "10px 0",
            textDecoration: "none",
          }}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default Unauthorized;
