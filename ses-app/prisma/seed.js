import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // =========================================================
  // AXIS 1 – Quality of Learning Outcomes
  // =========================================================
  console.log("🌱 Seeding Axis 1: Quality of Learning Outcomes...");

  const axis1 = await prisma.axis.upsert({
    where: { id: "axis-1-learning-outcomes" },
    update: {},
    create: {
      id: "axis-1-learning-outcomes",
      nameEn: "Quality of Learning Outcomes",
      nameAr: "جودة نواتج التعلم",
      descriptionEn:
        "Explore the three axes and the domains associated with each axis to learn about the required indicators and evidence.",
      descriptionAr:
        "استكشف المحاور الثلاثة والمجالات المرتبطة بكل محور لمعرفة المؤشرات والأدلة المطلوبة.",
    },
  });

  // ---------- Domain 1.1 – Academic Achievement ----------
  const domainAcademic = await prisma.domain.upsert({
    where: { id: "domain-1-1-academic-achievement" },
    update: {},
    create: {
      id: "domain-1-1-academic-achievement",
      code: "D1.1",
      nameEn: "Academic Achievement",
      nameAr: "الإنجاز الدراسي",
      descriptionEn:
        "Measures student academic performance and learning outcomes.",
      descriptionAr: "يقيس الأداء الأكاديمي للطلاب ونواتج التعلم.",
      axisId: axis1.id,
    },
  });

  // ---------- Domain 1.2 – Personal Growth ----------
  const domainPersonal = await prisma.domain.upsert({
    where: { id: "domain-1-2-personal-growth" },
    update: {},
    create: {
      id: "domain-1-2-personal-growth",
      code: "D1.2",
      nameEn: "Personal Growth",
      nameAr: "النمو الشخصي",
      descriptionEn:
        "Supports students' personal, social, and emotional development.",
      descriptionAr:
        "يدعم النمو الشخصي والاجتماعي والانفعالي للطلاب.",
      axisId: axis1.id,
    },
  });

  // ---------- Standards for Domain 1.1 – Academic Achievement ----------
  const standardsDomain1 = [
    {
      id: "standard-1-0-self-eval-academic",
      code: "D1.1-SE",
      nameEn: "Self-Evaluation for Academic Achievement",
      nameAr: "التقويم الذاتي لمجال الإنجاز الدراسي",
    },
    {
      id: "standard-1-1-attainment",
      code: "1.1",
      nameEn: "Academic Attainment",
      nameAr: "التحصيل الدراسي",
    },
    {
      id: "standard-1-2-progress",
      code: "1.2",
      nameEn: "Academic Progress",
      nameAr: "التقدم الدراسي",
    },
    {
      id: "standard-1-3-learning-skills",
      code: "1.3",
      nameEn: "Learning Skills",
      nameAr: "مهارات التعلم",
    },
  ];

  for (const s of standardsDomain1) {
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        code: s.code,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        domainId: domainAcademic.id,
      },
    });
  }

  // ---------- Standards for Domain 1.2 – Personal Growth ----------
  const standardsDomain2 = [
    {
      id: "standard-2-0-self-eval-growth",
      code: "D1.2-SE",
      nameEn: "Self-Evaluation for Personal Growth",
      nameAr: "التقويم الذاتي لمجال النمو الشخصي",
    },
    {
      id: "standard-2-1-values-behavior",
      code: "2.1",
      nameEn: "Values and Behavior",
      nameAr: "القيم والسلوك",
    },
    {
      id: "standard-2-2-identity-citizenship",
      code: "2.2",
      nameEn: "Identity and Citizenship",
      nameAr: "الهوية والمواطنة",
    },
    {
      id: "standard-2-3-health-environment",
      code: "2.3",
      nameEn: "Health and Environmental Awareness",
      nameAr: "الوعي الصحي والبيئي",
    },
    {
      id: "standard-2-4-innovation-entrepreneurship",
      code: "2.4",
      nameEn: "Innovation and Entrepreneurship",
      nameAr: "الابتكار وريادة الأعمال",
    },
  ];

  for (const s of standardsDomain2) {
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        code: s.code,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        domainId: domainPersonal.id,
      },
    });
  }

  console.log("✅ Axis 1 seeded.");

  // =========================================================
  // AXIS 2 – Quality of School Processes
  // =========================================================
  console.log("🌱 Seeding Axis 2: Quality of School Processes...");

  const axis2 = await prisma.axis.upsert({
    where: { id: "axis-2-school-processes" },
    update: {},
    create: {
      id: "axis-2-school-processes",
      nameEn: "Quality of School Processes",
      nameAr: "جودة عمليات المدرسة",
      descriptionEn:
        "Covers the quality of teaching, assessment, school climate, and the learning environment.",
      descriptionAr:
        "يشمل جودة التدريس والتقويم، ومناخ المدرسة، وبيئة التعلم.",
    },
  });

  // ---------- Domain 2.1 – Teaching and Assessment ----------
  const domainTeaching = await prisma.domain.upsert({
    where: { id: "domain-2-1-teaching-assessment" },
    update: {},
    create: {
      id: "domain-2-1-teaching-assessment",
      code: "D2.1",
      nameEn: "Teaching and Assessment",
      nameAr: "التدريس والتقويم",
      descriptionEn:
        "Focuses on planning, delivering, and assessing teaching and learning.",
      descriptionAr:
        "يركز على تخطيط التدريس وتنفيذه وتقويم عملية التعلم.",
      axisId: axis2.id,
    },
  });

  // ---------- Domain 2.2 – School Climate and Learning Environment ----------
  const domainClimate = await prisma.domain.upsert({
    where: { id: "domain-2-2-school-climate-learning-env" },
    update: {},
    create: {
      id: "domain-2-2-school-climate-learning-env",
      code: "D2.2",
      nameEn: "School Climate and Learning Environment",
      nameAr: "مناخ المدرسة وبيئة التعلم",
      descriptionEn:
        "Covers school relationships, wellbeing, and the learning environment.",
      descriptionAr:
        "يتناول العلاقات المدرسية والرفاه وبيئة التعلم.",
      axisId: axis2.id,
    },
  });

  // ---------- Standards for Domain 2.1 – Teaching and Assessment ----------
  const standardsTeaching = [
    {
      id: "standard-3-0-self-eval-teaching-assessment",
      code: "D2.1-SE",
      nameEn: "Self-Evaluation for Teaching and Assessment",
      nameAr: "التقويم الذاتي لمجال التدريس والتقويم",
    },
    {
      id: "standard-3-1-planning-teaching",
      code: "3.1",
      nameEn: "Planning for Teaching",
      nameAr: "التخطيط للتدريس",
    },
    {
      id: "standard-3-2-managing-learning",
      code: "3.2",
      nameEn: "Management of the Learning Process",
      nameAr: "إدارة عملية التعلم",
    },
    {
      id: "standard-3-3-teaching-effectiveness",
      code: "3.3",
      nameEn: "Effectiveness of Teaching",
      nameAr: "فاعلية التدريس",
    },
    {
      id: "standard-3-4-learning-to-life",
      code: "3.4",
      nameEn: "Connecting Learning to Life",
      nameAr: "ربط التعلم بالحياة",
    },
    {
      id: "standard-3-5-assessment-support-progress",
      code: "3.5",
      nameEn: "Assessment and Support of Progress",
      nameAr: "التقويم ومساندة التقدم",
    },
  ];

  for (const s of standardsTeaching) {
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        code: s.code,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        domainId: domainTeaching.id,
      },
    });
  }

  // ---------- Standards for Domain 2.2 – School Climate and Learning Environment ----------
  const standardsClimate = [
    {
      id: "standard-4-0-self-eval-school-climate",
      code: "D2.2-SE",
      nameEn:
        "Self-Evaluation for School Climate and Learning Environment",
      nameAr:
        "التقويم الذاتي لمجال مناخ المدرسة وبيئة التعلم",
    },
    {
      id: "standard-4-1-safe-stimulating-env",
      code: "4.1",
      nameEn: "Safe and Stimulating Learning Environment",
      nameAr: "بيئة تعلم آمنة ومحفزة",
    },
    {
      id: "standard-4-2-relationships-participation",
      code: "4.2",
      nameEn: "Relationships and School Participation",
      nameAr: "العلاقات والمشاركة المدرسية",
    },
    {
      id: "standard-4-3-wellbeing-care-support",
      code: "4.3",
      nameEn: "Wellbeing, Care and Support",
      nameAr: "الرفاه والرعاية والدعم",
    },
    {
      id: "standard-4-4-scientific-research-env",
      code: "4.4",
      nameEn: "Environment for Scientific Research",
      nameAr: "بيئة البحث العلمي",
    },
  ];

  for (const s of standardsClimate) {
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        code: s.code,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        domainId: domainClimate.id,
      },
    });
  }

  console.log("✅ Axis 2 seeded.");

  // =========================================================
  // AXIS 3 – Ensuring Quality of Learning Outcomes and Processes
  // =========================================================
  console.log(
    "🌱 Seeding Axis 3: Ensuring the Quality of Learning Outcomes and School Processes..."
  );

  const axis3 = await prisma.axis.upsert({
    where: { id: "axis-3-quality-assurance" },
    update: {},
    create: {
      id: "axis-3-quality-assurance",
      nameEn:
        "Ensuring the Quality of Learning Outcomes and School Processes",
      nameAr: "ضمان جودة نواتج التعلم وعمليات المدرسة",
      descriptionEn:
        "Focuses on leadership, management and governance to ensure the quality of learning outcomes and school processes.",
      descriptionAr:
        "يركز على القيادة والإدارة والحوكمة لضمان جودة نواتج التعلم وعمليات المدرسة.",
    },
  });

  // ---------- Domain 3.1 – Leadership, Management and Governance ----------
  const domainLeadership = await prisma.domain.upsert({
    where: { id: "domain-3-1-leadership-management-governance" },
    update: {},
    create: {
      id: "domain-3-1-leadership-management-governance",
      code: "D3.1",
      nameEn: "Leadership, Management and Governance",
      nameAr: "القيادة والإدارة والحوكمة",
      descriptionEn:
        "Covers strategic leadership, management efficiency and good governance.",
      descriptionAr:
        "يتناول القيادة الاستراتيجية والكفاءة الإدارية وتطبيق الحوكمة الجيدة.",
      axisId: axis3.id,
    },
  });

  const standardsLeadership = [
    {
      id: "standard-5-0-self-eval-leadership-governance",
      code: "D3.1-SE",
      nameEn:
        "Self-Evaluation for Leadership, Management and Governance",
      nameAr:
        "التقويم الذاتي لمجال القيادة والإدارة والحوكمة",
    },
    {
      id: "standard-5-1-leading-change",
      code: "5.1",
      nameEn: "Leading Change",
      nameAr: "قيادة التغيير",
    },
    {
      id: "standard-5-2-leading-teaching-learning",
      code: "5.2",
      nameEn: "Leading Teaching and Learning",
      nameAr: "قيادة التعليم والتعلم",
    },
    {
      id: "standard-5-3-administrative-efficiency",
      code: "5.3",
      nameEn: "Administrative Efficiency",
      nameAr: "الكفاءة الإدارية",
    },
    {
      id: "standard-5-4-partnership-parents-community",
      code: "5.4",
      nameEn: "Partnership with Parents and the Community",
      nameAr: "الشراكة مع أولياء الأمور والمجتمع",
    },
    {
      id: "standard-5-5-governance",
      code: "5.5",
      nameEn: "Governance",
      nameAr: "الحوكمة",
    },
  ];

  for (const s of standardsLeadership) {
    await prisma.standard.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        code: s.code,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        domainId: domainLeadership.id,
      },
    });
  }

  console.log("✅ Axis 3 seeded.");

  console.log("🎉 All axes, domains, and standards seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
