export const MEMBER_ACTIVE = 7810;
export const ELECTION_DEFAULT_VALUE = {
  title: "เลือกตั้งกรรมการดำเนินการสหกรณ์ออมทรัพย์ พ.ม",
  year: "2568",
  maxSelections: "1",
  // set startAt to today at 08:00 and endAt to today at 11:30
  startAt: (() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  })(),
  endAt: (() => {
    const d = new Date();
    d.setHours(11, 30, 0, 0);
    return d;
  })(),
  isPublished: "false",
};

export const CANDIDATE_DEFAULT_VALUE = {
  name: "",
  bio: "",
  photoUrl: "",
};
