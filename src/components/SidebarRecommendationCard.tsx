import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";

const SidebarRecommendationCard = () => {
  const handleVisitSite = () => {
    window.open("https://www.4kdownload.com/?ref=mdi3nzi", "_blank");
  };

  return (
    <div className="recommendation-sidebar-card">
      <div className="recommendation-sidebar-header">
        <FaDownload />
        <h4>Download Music</h4>
      </div>
      
      <div className="recommendation-sidebar-content">
        <p>Need to download music? I recommend <strong>4K Video Downloader</strong> for high-quality downloads.</p>
        
        <button className="recommendation-sidebar-cta" onClick={handleVisitSite}>
          Get 4K Downloader <FaExternalLinkAlt />
        </button>
      </div>
    </div>
  );
};

export default SidebarRecommendationCard;
