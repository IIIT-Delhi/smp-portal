import React, { useState, useEffect } from "react";
import axios from "axios";
import departmentOptions from "../../../data/departmentOptions.json";
import JSZip from "jszip";

export const DownloadCSV = ({ type, list, handleExcellentListSave }) => {
  const [mentees, setMentees] = useState([]);
  const [isFirstTime, setisFirstTime] = useState(true);

  // Function to fetch Mentee list from Django endpoint
  const fetchMenteeList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getAllMentees/");
      setMentees(response.data);
    } catch (error) {
      console.error("Error fetching Mentee list:", error);
    }
  };

  // Call the function to fetch the Mentee list when the component loads
  useEffect(() => {
    if (isFirstTime && type === "mentorMenteeMapping") {
      setisFirstTime(false);
      fetchMenteeList();
    }
  }, [isFirstTime]);

  // Function to handle downloading Mentor-Mentee Pairings CSV
  const handleDownloadMentorMenteeCSV = () => {
    try {
      const sortedMentees = [...mentees].sort((a, b) => {
        const mentorNameComparison = a.mentorName.localeCompare(b.mentorName);
        if (mentorNameComparison !== 0) {
          return mentorNameComparison;
        }
        return a.mentorName.localeCompare(b.mentorName);
      });

      const mappedMentees = sortedMentees.map((mentee) => {
        const mentorDepartmentOption = departmentOptions[mentee.mentorDepartment];
        const menteeDepartmentOption = departmentOptions[mentee.department];
        
        if (!mentorDepartmentOption || !menteeDepartmentOption) {
          console.error("Invalid department options for mentee:", mentee);
          return null;
        }

        return {
          "Mentor Roll Number": mentee.mentorId,
          "Mentor Name": mentee.mentorName,
          "Mentor Email": mentee.mentorEmail,
          "Mentor Programme": mentee.mentorDepartment[0] === "B" ? "B.Tech" : "M.Tech",
          "Mentor Department": mentorDepartmentOption.split(" ")[0],
          "Mentor Contact": mentee.mentorContact,
          "Mentee Roll Number": mentee.id,
          "Mentee Name": mentee.name,
          "Mentee Email": mentee.email,
          "Mentee Programme": mentee.department[0] === "B" ? "B.Tech" : "M.Tech",
          "Mentee Department": menteeDepartmentOption.split(" ")[0],
          "Mentee Contact": mentee.contact,
        };
      }).filter(Boolean); // Remove any null entries

      const csvData = convertToCSV(mappedMentees);
      downloadCSV(csvData, "Mentor-Mentees_AY_.csv");
    } catch (error) {
      console.error("Error creating CSV and downloading:", error);
      alert("Error creating CSV and downloading");
    }
  };

  // Function to handle downloading Excellence Award CSV
  const handleDownloadExcellenceAwardCSV = () => {
    try {
      const csvData = generateExcellenceAwardCSV(list);
      downloadCSV(csvData, "Excellence_Award_List.csv");
      handleExcellentListSave();
    } catch (error) {
      console.error("Error creating CSV and downloading:", error);
      alert("Error creating CSV and downloading");
    }
  };

  // Function to handle downloading Mentor Images as a zip file
  const handleDownloadMentorImages = () => {
    try {
      if (!list || list.length === 0) {
        alert("No mentors found. Unable to download mentor images.");
        return;
      }
      const zip = new JSZip();
      list.forEach((mentor) => {
        if (mentor.imgSrc) {
          const imageBlob = b64toBlob(mentor.imgSrc, "image/jpeg");
          zip.file(`${mentor.id}.jpeg`, imageBlob, { binary: true });
        } else {
          console.warn("Missing image source for mentor:", mentor.id);
        }
      });
      // Generate the CSV content
      const csvContent = generateMentorCSV(list);

      // Add CSV file to the zip
      zip.file("mentorDetails.csv", csvContent);

      // Generate the zip file asynchronously
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a Blob URL for the zip content
        const blobURL = URL.createObjectURL(content);

        // Create a link element
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "mentorImages.zip";

        // Append the link to the document body
        document.body.appendChild(link);

        // Trigger a click event on the link to initiate the download
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error("Error creating and downloading mentor images:", error);
      alert("Error creating and downloading mentor images");
    }
  };

  // Function to generate the CSV content for mentor details
  const generateMentorCSV = (list) => {
    const csvData = list.map((mentor) => ({
      "Roll Number": mentor.id,
      Name: mentor.name,
      Email: mentor.email,
      Programme: mentor.department[0] === "B" ? "B.Tech" : "M.Tech",
      Department: departmentOptions[mentor.department].split(" ")[0],
      Contact: mentor.contact,
      "Image Path": `${mentor.id}.jpeg`,
    }));
    return convertToCSV(csvData);
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const dataURLPattern = /^data:([^;]+);base64,(.*)$/;
    const matches = b64Data.match(dataURLPattern);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 data URL");
    }
    const [, mime, base64] = matches;
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((entry) => Object.values(entry).join(","));
    return `${header}\n${rows.join("\n")}`;
  };

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcellenceAwardCSV = (list) => {
    const csvData = list.map((mentor) => ({
      "Roll Number": mentor.id,
      Name: mentor.name,
      Programme: mentor.department[0] === "B" ? "B.Tech" : "M.Tech",
      Department: departmentOptions[mentor.department].split(" ")[0],
      Score: mentor.score,
      Status: mentor.status === 1 ? "Selected" : "Not Selected",
    }));
    return convertToCSV(csvData);
  };

  return (
    <>
      <button
        className="btn btn-primary mx-2"
        onClick={
          type === "mentorMenteeMapping"
            ? handleDownloadMentorMenteeCSV
            : type === "excellenceAward"
            ? handleDownloadExcellenceAwardCSV
            : handleDownloadMentorImages // Assuming the third condition is for "mentorImagesDownload"
        }
        data-toggle="tooltip"
        data-placement="bottom"
        title={
          type === "mentorMenteeMapping"
            ? "Download Mentor-Mentee Pairings in CSV format"
            : type === "excellenceAward"
            ? "Send mail, Save and Download Excellence Award List in CSV format"
            : "Download Mentor Images"
        }
      >
        {type === "mentorMenteeMapping"
          ? "Download Mentor-Mentee Pairings"
          : type === "excellenceAward"
          ? "Save and Downlaod"
          : "Download Mentor Images"}
      </button>
    </>
  );
};
