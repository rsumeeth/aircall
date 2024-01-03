import React, { useEffect, useState } from "react";
import axios from "axios";
import data from "../../../public/data.json";

export const InboxFeed = () => {
  const [activities, setActivities] = useState([]);
  const [archivedActivities, setArchivedActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = "https://cerulean-marlin-wig.cyclic.app/";
        const response = await axios.get(`${baseURL}/activities`);
        setActivities(response.data); // Assuming the data is an array of activities
        console.log(response.data);
      } catch (error) {
        // Handle error, for example, CORS issue
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const archiveActivity = async (activityId) => {
    try {
      // Perform PATCH request to update is_archived field of the activity
      const baseURL = "https://cerulean-marlin-wig.cyclic.app/";
      await axios.patch(`${baseURL}/activities/${activityId}`, {
        is_archived: true,
      });

      // Update state - move the activity to archivedActivities
      const updatedActivities = activities.filter(
        (activity) => activity.id !== activityId
      );
      const archivedActivity = activities.find(
        (activity) => activity.id === activityId
      );
      setActivities(updatedActivities);
      setArchivedActivities([...archivedActivities, archivedActivity]);
    } catch (error) {
      console.error("Error archiving activity:", error);
    }
  };

  const unarchiveActivity = async (activityId) => {
    try {
      // Perform PATCH request to update is_archived field of the activity
      const baseURL = "https://cerulean-marlin-wig.cyclic.app/";
      await axios.patch(`${baseURL}/activities/${activityId}`, {
        is_archived: false,
      });

      // Update state - move the activity back to activities
      const updatedArchivedActivities = archivedActivities.filter(
        (activity) => activity.id !== activityId
      );
      const unarchivedActivity = archivedActivities.find(
        (activity) => activity.id === activityId
      );
      setArchivedActivities(updatedArchivedActivities);
      setActivities([...activities, unarchivedActivity]);
    } catch (error) {
      console.error("Error unarchiving activity:", error);
    }
  };

  return (
    <div>
      <div>
        <h1>Activity Feed</h1>
        <ul>
          {activities
            .filter((activity) => !activity.is_archived) // Filter out archived activities
            .map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  padding: "10px",
                  border: "2px solid black",
                  margin: "2px",
                }}
              >
                <div>
                  {item.direction == "inbound"
                    ? item.from
                    : item.direction == "outbound"
                    ? item.to
                    : null}
                </div>
                <button onClick={() => archiveActivity(activity.id)}>
                  Archive
                </button>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};
