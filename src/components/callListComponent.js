import React, { useState, useEffect } from "react";
import axios from "axios";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import InfoIcon from "@mui/icons-material/Info";
import Typography from "@mui/material/Typography";

const CallListComponent = () => {
  const [calls, setCalls] = useState([]);
  const [showArchived, setShowArchived] = useState(true);

  const formatDateFromRFC3339 = (rfc3339Date) => {
    const date = new Date(rfc3339Date);
    // Example formatting: January 1, 2023, 12:00 PM
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedDate;
  };

  useEffect(() => {
    fetchCalls();
  }, [showArchived]);

  const fetchCalls = async () => {
    try {
      const response = await axios.get(
        "https://cerulean-marlin-wig.cyclic.app/activities"
      );

      setCalls(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCallNumber = (call) => {
    return call.direction === "outbound" ? call.to : call.from;
  };

  const toggleArchived = () => {
    setShowArchived(!showArchived);
  };

  const filteredCalls = calls.filter((call) =>
    showArchived ? call.is_archived : !call.is_archived
  );

  const getCallIcon = (callType) => {
    switch (callType) {
      case "inbound":
        return <CallReceivedIcon />;
      case "outbound":
        return <CallMadeIcon />;
      case "missed":
        return <CallMissedIcon />;
      default:
        return null;
    }
  };

  const organizeCallsByDate = () => {
    const organizedCalls = {};
    filteredCalls.forEach((call) => {
      const date = formatDateFromRFC3339(call.created_at).split(",")[0]; // Get date without time
      if (!organizedCalls[date]) {
        organizedCalls[date] = [];
      }
      organizedCalls[date].push(call);
    });
    return organizedCalls;
  };

  const contactsByDate = organizeCallsByDate();

  return (
    <div>
      <h1>List of {showArchived ? "Archived" : "Unarchived"} Calls</h1>{" "}
      <button onClick={toggleArchived}>
        Show {showArchived ? "Unarchived" : "Archived"} Calls
      </button>
      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        {Object.entries(contactsByDate).map(([date, calls]) => (
          <div key={date} style={{ textAlign: "center" }}>
            <Typography variant="h6">{date}</Typography>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {calls.map((call) => (
                <li
                  key={call.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px",
                  }}
                >
                  {getCallIcon(call.direction)}
                  <Typography variant="body1">
                    <strong>{getCallNumber(call)}</strong>{" "}
                    <div style={{ color: "lightgray" }}>
                      {
                        formatDateFromRFC3339(call.created_at)
                          .split(", ")[1]
                          .split(" ")[2]
                      }
                    </div>
                  </Typography>
                  <InfoIcon style={{ marginRight: "8px" }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>{" "}
    </div>
  );
};

export default CallListComponent;
