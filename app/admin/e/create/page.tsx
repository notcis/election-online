import ElectionForm from "../components/election-form";

export default function page() {
  return (
    <div className="mt-5 max-w-6xl mx-auto">
      <ElectionForm type="create" />
    </div>
  );
}
