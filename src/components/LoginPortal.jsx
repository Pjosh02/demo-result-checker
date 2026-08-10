import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function LoginPortal() {
  const {
    currentRole,
    setCurrentRole,
    schoolName,
    schoolSubtitle,
    validateLookup,
    setViewingResult,
    loginTeacher,
    loginAdmin,
    lockoutUntil,
    setLockoutUntil,
    setFailedAttempts,
    maintenanceMode,
    schoolLogo
  } = useContext(AppContext);

  // Sync tab selection with top navbar roles
  const [activeTab, setActiveTab] = useState(currentRole === 'student' ? 'student' : 'staff');

  // Student Form Inputs
  const [studName, setStudName] = useState('');
  const [studRollNo, setStudRollNo] = useState('');

  // Staff Form Inputs
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  // Common UI states
  const [errorMsg, setErrorMsg] = useState('');
  const [locked, setLocked] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Student matching states (from StudentLookup)
  const [matchedStudent, setMatchedStudent] = useState(null);
  const [availableResults, setAvailableResults] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [statusMessage, setStatusMessage] = useState('');

  // Keep Login Portal tabs in sync with top navigation role picks
  useEffect(() => {
    if (currentRole === 'student') {
      setActiveTab('student');
    } else {
      setActiveTab('staff');
    }
    setErrorMsg('');
  }, [currentRole]);

  // Lockout countdown timer for student lookups
  useEffect(() => {
    if (!lockoutUntil) {
      setLocked(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setLocked(false);
        setErrorMsg('');
        clearInterval(interval);
      } else {
        setLocked(true);
        setSecondsRemaining(Math.ceil((lockoutUntil - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil, setLockoutUntil, setFailedAttempts]);

  // Synchronize Tab Switching back to Top Navigation bar
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'student') {
      setCurrentRole('student');
      setMatchedStudent(null);
    } else {
      setCurrentRole('student');
    }
    setErrorMsg('');
  };

  // Submit Student lookup verification
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studName.trim() || !studRollNo.trim()) {
      setErrorMsg('Please enter both name and roll number.');
      return;
    }

    setErrorMsg('');
    setStatusMessage('');

    const lookup = validateLookup(studName, studRollNo);

    if (!lookup.success) {
      setErrorMsg(lookup.error);
      if (lookup.locked) {
        setLocked(true);
      }
      return;
    }

    setMatchedStudent(lookup.student);
    setAvailableResults(lookup.resultsList);
    setErrorMsg('');

    if (lookup.resultsList.length === 0) {
      setStatusMessage('No result records found for your student profile. Please contact the administrator.');
      setSelectedResultIndex(-1);
    } else {
      setSelectedResultIndex(0);
      const defaultRes = lookup.resultsList[0];
      if (defaultRes.status !== 'published') {
        setStatusMessage('Result not yet available. The school is currently compiling results for this term. Please check back later.');
      } else {
        setStatusMessage('');
      }
    }
  };

  const handleResultSelect = (idx) => {
    setSelectedResultIndex(idx);
    const selected = availableResults[idx];
    if (selected.status !== 'published') {
      setStatusMessage('Result not yet available. The school is currently compiling results for this term. Please check back later.');
    } else {
      setStatusMessage('');
    }
  };

  const handleCheckResult = () => {
    if (selectedResultIndex < 0) return;
    const selected = availableResults[selectedResultIndex];
    if (selected.status === 'published') {
      setViewingResult(selected);
    }
  };

  const handleResetStudent = () => {
    setMatchedStudent(null);
    setAvailableResults([]);
    setSelectedResultIndex(-1);
    setStudName('');
    setStudRollNo('');
    setErrorMsg('');
    setStatusMessage('');
  };

  // Submit Staff Credentials Authentication
  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffEmail.trim() || !staffPassword.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setErrorMsg('');

    // 1. Try Admin login
    const adminSuccess = loginAdmin(staffEmail, staffPassword);
    if (adminSuccess) {
      setStaffEmail('');
      setStaffPassword('');
      setCurrentRole('admin');
      return;
    }

    // 2. Try Teacher login
    const teacherSuccess = loginTeacher(staffEmail, staffPassword);
    if (teacherSuccess) {
      setStaffEmail('');
      setStaffPassword('');
      setCurrentRole('teacher');
      return;
    }

    // 3. Fallback: failed credentials
    setErrorMsg('Invalid email or password. Please verify credentials.');
  };

  const nameParts = schoolName.split(' ');
  const firstWord = nameParts[0] || 'HIGGSFIELD';
  const restOfName = nameParts.slice(1).join(' ') || 'Academy';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem 0' }}>
      <div className="login-portal-container">
        
        {/* Left Side: Brand side */}
        <div className="login-portal-brand-side">
          <div style={{
            marginBottom: '1.5rem',
            padding: '4px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: '50%',
            display: 'inline-flex',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <img 
              src={schoolLogo} 
              alt={`${schoolName} Logo`} 
              style={{ width: '80px', height: '80px', objectFit: 'contain', padding: '10px', backgroundColor: '#ffffff', borderRadius: '50%' }}
            />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {firstWord} <span style={{ fontWeight: 400, opacity: 0.85 }}>{restOfName}</span>
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: '0.5rem 0 2rem 0', maxWidth: '320px', lineHeight: '1.5' }}>
            {schoolSubtitle}
          </p>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', width: '80%' }}>
            Academic Records Dispatch & Marks Compilation Engine
          </div>
        </div>

        {/* Right Side: Form side */}
        <div className="login-portal-form-side">
          
          {/* Tab Selection */}
          <div className="login-tabs-container">
            <button 
              type="button" 
              className={`login-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => handleTabChange('student')}
            >
              Student Portal
            </button>
            <button 
              type="button" 
              className={`login-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => handleTabChange('staff')}
            >
              Staff Login
            </button>
          </div>

          {/* Error Message Panel */}
          {errorMsg && (
            <div className="alert-message alert-error" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Access Portal View */}
          {activeTab === 'student' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {maintenanceMode ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warning-light)',
                    color: 'var(--warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Portal Under Compilations</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '340px' }}>
                    The student results checker portal is temporarily locked. We are currently compiling new academic marks and updates. Please check back later.
                  </p>
                </div>
              ) : (
                <>
                  {locked && (
                    <div className="alert-message alert-warning" style={{ flexDirection: 'column', gap: '0.25rem', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span style={{ fontWeight: 'bold', fontSize: '0.95rem', marginTop: '0.25rem' }}>Access Temporarily Locked</span>
                      <span style={{ fontSize: '0.8rem' }}>Too many failed attempts. Please wait {secondsRemaining} seconds.</span>
                    </div>
                  )}

                  {!matchedStudent && !locked && (
                    <form onSubmit={handleStudentSubmit}>
                      <div className="form-group">
                        <label htmlFor="studName">Student Full Name</label>
                        <input
                          id="studName"
                          type="text"
                          className="form-control"
                          placeholder="e.g. Adegoke Samson"
                          value={studName}
                          onChange={(e) => setStudName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="studRoll">Roll Number</label>
                        <input
                          id="studRoll"
                          type="number"
                          min="0"
                          max="5000"
                          className="form-control"
                          placeholder="e.g. 481"
                          value={studRollNo}
                          onChange={(e) => setStudRollNo(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '1rem', fontWeight: 600 }}
                      >
                        Access Student Records
                      </button>
                    </form>
                  )}

                  {matchedStudent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)'
                      }}>
                        <img
                          src={matchedStudent.photo}
                          alt={matchedStudent.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{matchedStudent.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Class: {matchedStudent.classId.toUpperCase()} • Roll No: {matchedStudent.rollNo}</p>
                        </div>
                      </div>

                      {availableResults.length > 0 && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label htmlFor="resultTermSelect">Available Academic Terms</label>
                          <select
                            id="resultTermSelect"
                            className="form-control"
                            value={selectedResultIndex}
                            onChange={(e) => handleResultSelect(parseInt(e.target.value))}
                          >
                            {availableResults.map((r, idx) => (
                              <option key={r.id} value={idx}>
                                {r.session} session - {r.term}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {statusMessage && (
                        <div className={`alert-message ${availableResults.length > 0 ? 'alert-warning' : 'alert-error'}`} style={{ margin: 0 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span style={{ fontSize: '0.8rem' }}>{statusMessage}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={handleResetStudent}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '0.7rem' }}
                        >
                          Reset Search
                        </button>

                        {availableResults.length > 0 && availableResults[selectedResultIndex]?.status === 'published' && (
                          <button
                            onClick={handleCheckResult}
                            className="btn btn-primary"
                            style={{ flex: 1.5, padding: '0.7rem', fontWeight: 600 }}
                          >
                            View Result Sheet
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Staff Access Portal View */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-group">
                <label htmlFor="staffMail">School Email Address</label>
                <input
                  id="staffMail"
                  type="email"
                  className="form-control"
                  placeholder="e.g. emily.cole@higgsfield.edu"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="staffPass">Password</label>
                <input
                  id="staffPass"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '1.25rem', fontWeight: 600 }}
              >
                Authenticate Staff Login
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
