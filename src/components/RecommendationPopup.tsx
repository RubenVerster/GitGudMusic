import { useState, useEffect } from "react";
import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const RecommendationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this popup
    const dismissed = localStorage.getItem("recommendation-popup-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("recommendation-popup-dismissed", "true");
  };

  const handleVisitSite = () => {
    window.open("https://www.4kdownload.com/?ref=mdi3nzi", "_blank");
    handleDismiss();
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="recommendation-popup">
      <div className="recommendation-card">
        <button className="recommendation-close" onClick={handleDismiss}>
          <FaTimes />
        </button>

        <div className="recommendation-content">
          <div className="recommendation-text">
            <h4>Do you also have great music?</h4>
            <p>
              I recommend <strong>4K Video Downloader</strong> for high-quality
              music downloads from YouTube and many platforms.
            </p>
          </div>

          <button className="recommendation-cta" onClick={handleVisitSite}>
            Check it out <FaExternalLinkAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPopup;
