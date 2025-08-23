import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { Card, Loading } from "../ui";
import Table from "../Table";
import axios from "axios";
import departmentOptions from "../../data/departmentOptions.json";

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = useState({});
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const schema = {
    id: "",
    name: "",
    email: "",
    department: "",
    contact: "",
    archived_at: "",
  };

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/getHistoricalData/", {
        years: 5,
        user_type: selectedUserType || undefined,
        department: selectedDepartment || undefined,
        academic_year: selectedYear || undefined
      });

      setHistoricalData(response.data.historical_data);
      setStatistics(response.data.statistics);
      setAvailableYears(response.data.available_years);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getAcademicYears/");
      setAcademicYears(response.data.academic_years);
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    fetchAcademicYears();
  }, [selectedYear, selectedUserType, selectedDepartment]);

  const handleArchiveData = async () => {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    const confirmArchive = window.confirm(
      `Are you sure you want to archive current data for academic year ${academicYear}? This will move all current mentors and mentees to historical data.`
    );
    
    if (!confirmArchive) return;

    const clearCurrent = window.confirm(
      "Do you also want to clear the current tables after archiving? (This will remove all current data to make space for new batches)"
    );

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/archiveCurrentData/", {
        academic_year: academicYear,
        semester: "Even",
        archived_by: "Admin",
        clear_current: clearCurrent
      });

      alert(`Data archived successfully!\nMentors: ${response.data.archived_counts.mentors}\nMentees: ${response.data.archived_counts.mentees}\nCandidates: ${response.data.archived_counts.candidates}`);
      
      // Refresh data
      fetchHistoricalData();
      fetchAcademicYears();
    } catch (error) {
      console.error("Error archiving data:", error);
      alert("Error archiving data: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderDataTable = (data, userType, year) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted">No {userType} data found for {year}</p>
        </div>
      );
    }

    const tableRows = data.map((item) => (
      <tr key={`${item.id}-${userType}`}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{departmentOptions[item.department] || item.department}</td>
        <td>{item.contact || "N/A"}</td>
        <td>{new Date(item.archived_at).toLocaleDateString()}</td>
      </tr>
    ));

    return (
      <div style={{ overflowX: "auto" }}>
        <Table
          headers={["ID", "Name", "Email", "Department", "Contact", "Archived Date"]}
          rows={tableRows}
          searchable={true}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loading fullScreen text="Loading historical data..." size="lg" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--light-gray)", minHeight: "100vh" }}>
      <Navbar />
      
      <div
        className="container py-4"
        style={{
          marginLeft: "70px",
          paddingTop: "80px !important",
          transition: "margin-left 0.3s ease"
        }}
      >
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="h2 mb-1" style={{ color: "var(--primary-dark-blue)" }}>
                  Historical Data Archive
                </h1>
                <p className="text-muted mb-0">
                  View and manage historical mentor and mentee data from previous academic years
                </p>
              </div>
              <button
                onClick={handleArchiveData}
                style={{
                  backgroundColor: "var(--warning)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Archive Current Data
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <Card headerTitle="Filters" headerColor="primary">
              <Card.Body>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Academic Year</label>
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">All Years</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">User Type</label>
                    <select
                      className="form-select"
                      value={selectedUserType}
                      onChange={(e) => setSelectedUserType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="mentor">Mentors</option>
                      <option value="mentee">Mentees</option>
                      <option value="candidate">Candidates</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {Object.keys(departmentOptions).map((dept) => (
                        <option key={dept} value={dept}>
                          {departmentOptions[dept]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          {Object.keys(statistics).map((year) => (
            <div key={year} className="col-lg-3 col-md-6 mb-3">
              <Card headerTitle={year} headerColor="success">
                <Card.Body>
                  <div className="text-center">
                    <div className="row text-center">
                      <div className="col-4">
                        <h6 style={{ color: "var(--accent-blue)", marginBottom: "4px" }}>
                          {statistics[year].mentor_count || 0}
                        </h6>
                        <small className="text-muted">Mentors</small>
                      </div>
                      <div className="col-4">
                        <h6 style={{ color: "var(--orange-highlight)", marginBottom: "4px" }}>
                          {statistics[year].mentee_count || 0}
                        </h6>
                        <small className="text-muted">Mentees</small>
                      </div>
                      <div className="col-4">
                        <h6 style={{ color: "var(--primary-dark-blue)", marginBottom: "4px" }}>
                          {statistics[year].candidate_count || 0}
                        </h6>
                        <small className="text-muted">Candidates</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* Historical Data Tables */}
        {Object.keys(historicalData).length === 0 ? (
          <div className="row">
            <div className="col-12">
              <Card>
                <Card.Body>
                  <div className="text-center py-5">
                    <h5 className="text-muted">No Historical Data Found</h5>
                    <p className="text-muted">
                      No historical data matches your current filters. Try adjusting the filters or archive some data first.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        ) : (
          Object.keys(historicalData)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <div key={year} className="row mb-4">
                <div className="col-12">
                  <Card headerTitle={`Academic Year: ${year}`} headerColor="primary">
                    <Card.Body>
                      {/* Mentors */}
                      {historicalData[year].mentor && (
                        <div className="mb-4">
                          <h5 className="mb-3" style={{ color: "var(--accent-blue)" }}>
                            Mentors ({historicalData[year].mentor.length})
                          </h5>
                          {renderDataTable(historicalData[year].mentor, "mentor", year)}
                        </div>
                      )}
                      
                      {/* Mentees */}
                      {historicalData[year].mentee && (
                        <div className="mb-4">
                          <h5 className="mb-3" style={{ color: "var(--orange-highlight)" }}>
                            Mentees ({historicalData[year].mentee.length})
                          </h5>
                          {renderDataTable(historicalData[year].mentee, "mentee", year)}
                        </div>
                      )}
                      
                      {/* Candidates */}
                      {historicalData[year].candidate && (
                        <div className="mb-4">
                          <h5 className="mb-3" style={{ color: "var(--primary-dark-blue)" }}>
                            Candidates ({historicalData[year].candidate.length})
                          </h5>
                          {renderDataTable(historicalData[year].candidate, "candidate", year)}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default HistoricalData;
