import { prisma } from "@/lib/prisma";

const seedElection = async () => {
  const election = await prisma.election.create({
    data: {
      title: "การเลือกตั้งกรรมการดำเนินการสหกรณ์ออมทรัพย์ พ.ม. ประจำปี 2569",
      year: 2568,
      maxSelections: 8,
      startAt: new Date("2024-09-13T08:00:00Z"),
      endAt: new Date("2024-09-13T23:59:59Z"),
    },
  });

  console.log("Created election:", election);
};

const seedCandidates = async () => {
  const candidatesData = [
    {
      name: "นายสมชาย ใจดี",
      bio: "นายสมชาย ใจดี มีประสบการณ์ในการทำงานด้านการเงินและการบริหารจัดการสหกรณ์มากว่า 10 ปี เขามุ่งมั่นที่จะพัฒนาสหกรณ์ให้เติบโตอย่างยั่งยืนและเป็นประโยชน์ต่อสมาชิกทุกคน",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "นางสาวสมหญิง แสนสวย",
      bio: "นางสาวสมหญิง แสนสวย มีความเชี่ยวชาญด้านการตลาดและการสื่อสาร เธอมีวิสัยทัศน์ที่จะนำสหกรณ์เข้าสู่ยุคดิจิทัลและเพิ่มช่องทางการเข้าถึงบริการของสหกรณ์ให้กับสมาชิกทุกคน",
      photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "นายวิทยา เก่งกล้า",
      bio: "นายวิทยา เก่งกล้า เป็นผู้ที่มีความรู้ด้านกฎหมายและการบริหารความเสี่ยง เขามุ่งมั่นที่จะสร้างความโปร่งใสและความน่าเชื่อถือให้กับสหกรณ์ เพื่อให้สมาชิกมั่นใจในระบบการบริหารจัดการของสหกรณ์",
      photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "นางสาวสุดารัตน์ ใจงาม",
      bio: "นางสาวสุดารัตน์ ใจงาม มีประสบการณ์ในการทำงานด้านการพัฒนาชุมชนและการส่งเสริมเศรษฐกิจท้องถิ่น เธอมีความตั้งใจที่จะนำสหกรณ์เป็นเครื่องมือในการสร้างความเข้มแข็งให้กับชุมชนและสมาชิกทุกคน",
      photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "นายธนพล รักชาติ",
      bio: "นายธนพล รักชาติ มีความเชี่ยวชาญด้านการวางแผนกลยุทธ์และการบริหารโครงการ เขามุ่งมั่นที่จะพัฒนาสหกรณ์ให้มีประสิทธิภาพและสามารถตอบสนองความต้องการของสมาชิกในยุคปัจจุบัน",
      photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      name: "นางสาวปรียา สวยงาม",
      bio: "นางสาวปรียา สวยงาม มีประสบการณ์ในการทำงานด้านการเงินและการบัญชี เธอมีความตั้งใจที่จะนำความรู้และประสบการณ์ของเธอมาใช้ในการบริหารจัดการสหกรณ์ให้มีความมั่นคงและยั่งยืน",
      photoUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "นายกิตติพงษ์ กล้าหาญ",
      bio: "นายกิตติพงษ์ กล้าหาญ เป็นผู้ที่มีความรู้ด้านเทคโนโลยีสารสนเทศและการพัฒนาระบบ เขามุ่งมั่นที่จะนำเทคโนโลยีมาใช้ในการพัฒนาบริการของสหกรณ์ให้ทันสมัยและสะดวกสบายสำหรับสมาชิกทุกคน",
      photoUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "นางสาวอรทัย ใจดี",
      bio: "นางสาวอรทัย ใจดี มีประสบการณ์ในการทำงานด้านการบริหารทรัพยากรมนุษย์และการพัฒนาบุคลากร เธอมีความตั้งใจที่จะสร้างสภาพแวดล้อมการทำงานที่ดีและส่งเสริมความร่วมมือระหว่างสมาชิกในสหกรณ์",
      photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ];

  for (const candidate of candidatesData) {
    const createdCandidate = await prisma.candidate.create({
      data: {
        name: candidate.name,
        bio: candidate.bio,
        photoUrl: candidate.photoUrl,
      },
    });
    console.log("Created candidate:", createdCandidate);

    const createdElectionCandidate = await prisma.electionCandidate.create({
      data: {
        electionId: 1, // Assuming the election ID is 1
        candidateId: createdCandidate.id,
        ballotNo: createdCandidate.id, // Just using candidate ID as ballot number for simplicity
      },
    });

    console.log("Created election candidate:", createdElectionCandidate);
  }
};

seedCandidates();

//seedElection();
