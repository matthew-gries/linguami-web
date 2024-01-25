import { CircleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="loading">
      <CircleLoader
        size='10vmin'
      />
    </div>
  );
}