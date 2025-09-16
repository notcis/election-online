"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <h1 className="pb-4 font-bold">ไม่พบการเลือกตั้ง</h1>
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        {`Error: ${error.message}`}
      </div>
      <div className="p-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => {
            reset();
          }}
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  );
}
