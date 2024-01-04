import React, { useState, useEffect } from "react";
import axios from "axios";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import InfoIcon from "@mui/icons-material/Info";
import Typography from "@mui/material/Typography";
import data from "./../../public/data.json";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

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
      // const baseURL = "https://cerulean-marlin-wig.cyclic.app";
      // const response = await axios.get(`${baseURL}/activities`);
      // setCalls(response.data);

      const response = await fetch(data);
      setCalls(data);
      console.log(data);
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
      <Button
        variant="outlined"
        onClick={toggleArchived}
        style={{ width: "100%", borderTop: "none" }}
      >
        Show {showArchived ? "Unarchived" : "Archived"} Calls
      </Button>
      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        {Object.entries(contactsByDate).map(([date, calls]) => (
          <div key={date} style={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#8c8e8f" }}
            >
              {date}
            </Typography>
            <div style={{ listStyle: "none", padding: 0 }}>
              {calls.map((call) => (
                <div key={call.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <InfoIcon
                          style={{ marginRight: "8px", width: "20px" }}
                        />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      {getCallIcon(call.direction)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={getCallNumber(call)}
                      secondary={
                        formatDateFromRFC3339(call.created_at)
                          .split(", ")[1]
                          .split(" ")[2]
                      }
                    />
                  </ListItem>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallListComponent;
