import { useParams, useNavigate } from "react-router-dom";
import { CommunityDetailView } from "@/components/communities/CommunityDetailView";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/communities");
    return null;
  }

  return (
    <CommunityDetailView communityId={id} />
  );
};

export default CommunityDetail;
