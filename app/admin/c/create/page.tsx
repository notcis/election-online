import CandidateForm from "../components/candidate-form";

export default function page() {
  return (
    <div className="mt-5 max-w-6xl mx-auto">
      <h1 className="pb-4 font-bold">เพิ่มผู้สมัครใหม่</h1>
      <CandidateForm type="create" />
    </div>
  );
}
