import { Suspense } from "react";
import UploadPage from "./UploadPage";

export default function UploadRoute() {
  return (
    <Suspense fallback={null}>
      <UploadPage />
    </Suspense>
  );
}
