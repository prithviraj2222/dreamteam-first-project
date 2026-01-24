import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Home() {
  const [user, setUser] = useState({});
  const { id } = useParams();

  const fetchData = async () => {
    let data = await axios.get(`http://localhost:3000/users/${id}`);
    setUser(data.data[0]);
  };

  useEffect(() => {
    fetchData();
  }, [])
  return <div>Welcome {user.name}</div>;
}

export default Home;
