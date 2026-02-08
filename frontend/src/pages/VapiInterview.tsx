import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useVapi } from "../hooks/useVapi";
import { getInterview } from "../services/interview.service";
import type { Interview } from "../types";

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

export default function VapiInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const [interview, setInterview] = useState<Interview | undefined>(location.state?.interview);
  const [loading, setLoading] = useState(!location.state?.interview && !!id);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [autoStarted, setAutoStarted] = useState(false);

  // Initialize Vapi hook
  const {
    isCallActive,
    isMuted,
    isLoading,
    error,
    startCall,
    stopCall,
    toggleMute,
    transcript,
  } = useVapi({
    interview: interview || {
      id: "fallback",
      userId: "demo",
      role: "Software Engineer",
      type: "Technical",
      techstack: ["React", "TypeScript"],
      level: "Mid-Level",
      questions: [
        "Tell me about yourself and your professional background.",
        "What are your key technical strengths?",
        "Describe a challenging project you worked on.",
      ],
      finalized: true,
      createdAt: new Date().toISOString(),
    },
    onCallStart: () => {
      console.log("Vapi interview started");
    },
    onCallEnd: () => {
      console.log("Vapi interview ended");
      navigate("/results", {
        state: {
          interview,
          transcript: conversationHistory,
        },
      });
    },
    onMessage: (message: any) => {
      if (message.type === "transcript") {
        setConversationHistory((prev) => [...prev, message.text]);
      }
    },
    onError: (err: Error) => {
      console.error("Vapi error:", err);
    },
  });

  // Fetch interview data if ID is provided
  useEffect(() => {
    async function fetchInterview() {
      if (id && !interview) {
        console.log(`VapiInterview: Fetching interview with ID: ${id}`);
        setLoading(true);
        try {
          const data = await getInterview(id);
          console.log('VapiInterview: Received data:', data);
          if (data) {
            setInterview(data);
            console.log('VapiInterview: Interview set successfully');
          } else {
            console.error("VapiInterview: Interview not found, redirecting");
            navigate("/pre-interview");
          }
        } catch (error) {
          console.error("VapiInterview: Error fetching interview:", error);
          navigate("/pre-interview");
        } finally {
          setLoading(false);
        }
      } else if (!id && !interview) {
        console.warn("VapiInterview: No interview data or ID, redirecting to pre-interview");
        navigate("/pre-interview");
      } else if (interview) {
        console.log('VapiInterview: Interview already loaded:', interview);
      }
    }
    fetchInterview();
  }, [id, interview, navigate]);

  // Auto-start interview once loaded
  useEffect(() => {
    if (interview && !autoStarted && !isCallActive && !isLoading && !loading) {
      const timer = setTimeout(() => {
        handleStartInterview();
        setAutoStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [interview, autoStarted, isCallActive, isLoading, loading]);

  const handleStartInterview = async () => {
    await startCall();
  };

  const handleEndInterview = () => {
    stopCall();
  };

  if (loading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(3,179,195,0.2)",
          borderTop: "3px solid #03b3c3",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{
          fontFamily: '"Quicksand", sans-serif',
          color: "rgba(245,245,245,0.5)",
          fontSize: "0.9rem"
        }}>Loading interview...</p>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <>
      <style>{`
        .vapi-interview-wrapper {
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .vapi-interview-header {
          padding: 1.5rem 2rem;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .vapi-interview-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
        }
        .vapi-status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: ${isCallActive ? 'rgba(3,179,195,0.1)' : 'rgba(255,255,255,0.05)'};
          border-radius: 20px;
          margin-bottom: 2rem;
        }
        .vapi-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${isCallActive ? '#03b3c3' : 'rgba(255,255,255,0.3)'};
          animation: ${isCallActive ? 'pulse 2s ease-in-out infinite' : 'none'};
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .vapi-controls {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .vapi-button {
          padding: 1rem 2rem;
          font-family: "Quicksand", sans-serif;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .vapi-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .vapi-button-start {
          background: #03b3c3;
          color: white;
        }
        .vapi-button-start:hover:not(:disabled) {
          background: #029ba8;
          transform: translateY(-2px);
        }
        .vapi-button-stop {
          background: #e74c3c;
          color: white;
        }
        .vapi-button-stop:hover {
          background: #c0392b;
        }
        .vapi-button-mute {
          background: ${isMuted ? '#e74c3c' : '#2ecc71'};
          color: white;
        }
        .vapi-button-mute:hover {
          background: ${isMuted ? '#c0392b' : '#27ae60'};
        }
        .vapi-transcript {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          max-height: 300px;
          overflow-y: auto;
          width: 100%;
          max-width: 600px;
        }
        .vapi-error {
          padding: 1rem;
          background: rgba(231,76,60,0.1);
          border: 1px solid rgba(231,76,60,0.3);
          color: #e74c3c;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-family: "Quicksand", sans-serif;
        }
      `}</style>

      <div className="vapi-interview-wrapper">
        {/* Header */}
        <div className="vapi-interview-header">
          <span
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontSize: "1.8rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#F5F5F5",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.15em",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Samvaad
            <span style={{ color: "#03b3c3", fontWeight: 800 }}>AI</span>
            <span style={{ 
              fontSize: "0.65rem", 
              fontWeight: 500, 
              color: "rgba(3,179,195,0.6)",
              marginLeft: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}>
              Vapi Powered
            </span>
          </span>
        </div>

        <div className="vapi-interview-content">
          {/* Interview Info */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.035em",
                color: "#F5F5F5",
                margin: 0,
              }}
            >
              {interview.role}
            </h1>
            <p
              style={{
                fontFamily: '"Quicksand", sans-serif',
                fontSize: "1rem",
                color: "rgba(245,245,245,0.5)",
                marginTop: "0.5rem",
                marginBottom: 0,
              }}
            >
              {interview.level} • {interview.type} • {interview.questions.length} Questions
            </p>
            <div style={{ 
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {interview.techstack.map((tech, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "0.35rem 0.9rem",
                    background: "rgba(3,179,195,0.1)",
                    border: "1px solid rgba(3,179,195,0.2)",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    color: "#03b3c3",
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="vapi-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Status Indicator */}
          <div className="vapi-status-indicator">
            <div className="vapi-status-dot" />
            <span style={{ 
              fontSize: "0.9rem",
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500,
              color: isCallActive ? "#03b3c3" : "rgba(245,245,245,0.5)"
            }}>
              {isLoading ? "Connecting..." : isCallActive ? "Interview in progress" : "Ready to start"}
            </span>
          </div>

          {/* Controls */}
          <div className="vapi-controls">
            {!isCallActive ? (
              <button
                onClick={handleStartInterview}
                disabled={isLoading}
                className="vapi-button vapi-button-start"
              >
                <MicIcon />
                {isLoading ? "Connecting..." : "Start Voice Interview"}
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className="vapi-button vapi-button-mute"
                >
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={handleEndInterview}
                  className="vapi-button vapi-button-stop"
                >
                  <StopIcon />
                  End Interview
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          {!isCallActive && !isLoading && (
            <p style={{
              marginTop: "2rem",
              fontFamily: '"Quicksand", sans-serif',
              fontSize: "0.9rem",
              color: "rgba(245,245,245,0.4)",
              textAlign: "center",
              maxWidth: "500px",
              lineHeight: 1.6,
            }}>
              Click "Start Voice Interview" to begin your AI-powered interview session. 
              The AI interviewer will ask you questions and listen to your responses in real-time.
            </p>
          )}

          {/* Transcript */}
          {transcript.length > 0 && (
            <div className="vapi-transcript">
              <h3 style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontSize: "1rem",
                fontWeight: 700,
                color: "#03b3c3",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                Live Transcript
              </h3>
              {transcript.map((text: string, index: number) => (
                <p key={index} style={{
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "rgba(245,245,245,0.7)",
                  fontFamily: '"Quicksand", sans-serif',
                }}>
                  {text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
