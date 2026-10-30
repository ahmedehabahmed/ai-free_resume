import { useEffect, useRef } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCards = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    cardRef.current?.animate(
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 1000, easing: "ease-out" },
    );
  }, []);

  return (
    <Link ref={cardRef} to={`/resumes/${id}`} className="resume-card border-2 border-gray-200">
      <div className="resume-card-header ">
        <div className="flex flex-col gap-2 ">
          <h2 className="text-black! font-bold wrap-break-word">
            {companyName}
          </h2>
          <h3 className="text-lg wrap-break-word text-gray-500 ">{jobTitle}</h3>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="gradient-border">
        <div className="w-full h-full">
          <img
            src={imagePath}
            alt="resume"
            className="w-full h-87.5 max-sm:h-50 object-cover object-top"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCards;
