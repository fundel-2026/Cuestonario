import React, { createContext, useContext, useState, useEffect } from 'react';

const SurveyContext = createContext();

const STORAGE_KEY = 'survey_responses_v1';

export const SurveyProvider = ({ children }) => {
  const [responses, setResponses] = useState([]);
  const [newResponseNotification, setNewResponseNotification] = useState(null);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse responses", e);
      }
    }
  }, []);

  // Listen for storage events (other tabs updating data)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        const newValue = e.newValue;
        if (newValue) {
          const parsed = JSON.parse(newValue);
          setResponses(parsed);
          
          // Notify about new response (simple check: if length increased)
          const oldLen = responses.length;
          if (parsed.length > oldLen) {
            const latest = parsed[parsed.length - 1];
            setNewResponseNotification(latest);
            // Clear notification after 3s
            setTimeout(() => setNewResponseNotification(null), 3000);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [responses]); // Dependency on responses to compare length

  const addResponse = (newResponse) => {
    const responseWithTimestamp = {
      ...newResponse,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [...responses, responseWithTimestamp];
    setResponses(updatedResponses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResponses));
    
    // Dispatch a custom event for the current tab to update (storage event doesn't fire on same tab)
    // Actually we already updated state, so we just need to notify if we want a toast in this tab too (optional)
    // But usually only Dashboard needs the toast.
  };

  return (
    <SurveyContext.Provider value={{ responses, addResponse, newResponseNotification }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
