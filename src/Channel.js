import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import CreateQuestion from "./CreateQuestion";

function Channel() {
  let { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:8081/questions/by-channel-id/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setQuestions(response.data.questions);
        });
    }
  }, [navigate, authState.status, id]);

  const sortedPosts = questions.sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div>
      <CreateQuestion channelId={id} />
      {sortedPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.topic} </div>
            <div
              className="body"
              onClick={() => {
                navigate(`/question/${value.id}`);
              }}
            >
              {value.question}
            </div>
            <div className="footer">
              <div className="email">
                <Link to={`/profile/${value.UserId}`}> {value.email} </Link>
              </div>
              <label>{value.rating}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Channel;
