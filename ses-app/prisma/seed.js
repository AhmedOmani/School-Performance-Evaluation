const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- 1. Seed Admin User ---
  const email = "alahda2022@gmail.com";
  const password = "Admin@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin User",
      passwordHash: hashedPassword,
      role: "SYSTEM_MANAGER",
    },
  });

  console.log(`✅ Admin user created: ${user.email}`);

  // --- 2. Define AXES ---

  // Axis 1: Quality of Learning Outcomes
  const axis1 = await prisma.axis.create({
    data: {
      nameEn: 'Quality of Learning Outcomes',
      nameAr: 'جودة نواتج التعلم',
    },
  });

  // Axis 2: Quality of School Processes
  const axis2 = await prisma.axis.create({
    data: {
      nameEn: 'Quality of School Processes',
      nameAr: 'جودة عمليات المدرسة',
    },
  });

  // Axis 3: Assurance of Learning and School Processes Quality
  const axis3 = await prisma.axis.create({
    data: {
      nameEn: 'Assurance of Learning and School Processes Quality',
      nameAr: 'ضمان جودة التعلم وعمليات المدرسة',
    },
  });

  // --- 3. Define DOMAINS, STANDARDS, and INDICATORS ---

  const domainData = [
    // --- AXIS 1: Quality of Learning Outcomes ---
    {
      axisId: axis1.id,
      code: 'D1',
      nameEn: 'Academic Achievement',
      nameAr: 'الإنجاز الدراسي',
      standards: [
        {
          code: '1.1',
          nameEn: 'Academic Achievement',
          nameAr: 'التحصيل الدراسي',
          indicators: [
            { code: '1.1.1', descriptionEn: 'Achievement Levels', descriptionAr: 'المستويات التحصيلية' },
            { code: '1.1.2', descriptionEn: 'Achievement in Classroom and Non-Classroom Activities', descriptionAr: 'التحصيل في الأعمال الصفية وغير الصفية' },
            { code: '1.1.3', descriptionEn: 'Equity of Academic Achievement', descriptionAr: 'عدالة التحصيل الدراسي' },
          ],
        },
        {
          code: '1.2',
          nameEn: 'Academic Progress',
          nameAr: 'التقدم الدراسي',
          indicators: [
            { code: '1.2.1', descriptionEn: 'Achievement Levels Over Time', descriptionAr: 'المستويات التحصيلية بمرور الوقت' },
            { code: '1.2.2', descriptionEn: 'Academic Progress in Classroom Sessions', descriptionAr: 'التقدم الدراسي في الحصص الدراسية' },
            { code: '1.2.3', descriptionEn: 'Progress of Students with Special Needs', descriptionAr: 'تقدم الطلبة ذوي الاحتياجات الخاصة' },
          ],
        },
        {
          code: '1.3',
          nameEn: 'Learning Skills',
          nameAr: 'مهارات التعلم',
          indicators: [
            { code: '1.3.1', descriptionEn: 'Self-Learning Skills', descriptionAr: 'مهارات التعلم الذاتي' },
            { code: '1.3.2', descriptionEn: 'Collaborative Learning Skills', descriptionAr: 'مهارات التعلم التعاوني' },
            { code: '1.3.3', descriptionEn: 'Higher-Order Thinking Skills', descriptionAr: 'مهارات التفكير العليا' },
            { code: '1.3.4', descriptionEn: 'Application of Learning in Daily Life', descriptionAr: 'تطبيق التعلم في الحياة اليومية' },
            { code: '1.3.5', descriptionEn: 'Digital Skills', descriptionAr: 'المهارات الرقمية' },
            { code: '1.3.6', descriptionEn: 'Reading Culture', descriptionAr: 'ثقافة القراءة' },
          ],
        },
      ],
    },
    {
      axisId: axis1.id,
      code: 'D2',
      nameEn: 'Personal Growth',
      nameAr: 'النمو الشخصي',
      standards: [
        {
          code: '2.1',
          nameEn: 'Values and Behavior',
          nameAr: 'القيم والسلوك',
          indicators: [
            { code: '2.1.1', descriptionEn: 'Adherence to Shared Human Values', descriptionAr: 'التمسك بالقيم الإنسانية المشتركة' },
            { code: '2.1.2', descriptionEn: 'Awareness of Rights and Duties', descriptionAr: 'إدراك الحقوق والواجبات' },
            { code: '2.1.3', descriptionEn: 'Enthusiasm and Motivation for Learning', descriptionAr: 'الحماس والدافعية للتعلم' },
          ],
        },
        {
          code: '2.2',
          nameEn: 'Identity and Citizenship',
          nameAr: 'الهوية والمواطنة',
          indicators: [
            { code: '2.2.1', descriptionEn: 'Pride in Omani Identity, History, Culture, Loyalty to the Nation and the Sultan', descriptionAr: 'الاعتزاز بالهوية العُمانية وتاريخ سلطنة عمان وثقافتها، والولاء للوطن والسلطان' },
            { code: '2.2.2', descriptionEn: 'Belonging to the Arab and Islamic Identity, and Appreciation of the Arabic Language', descriptionAr: 'الانتماء للهوية العربية والإسلامية، وتقدير اللغة العربية' },
            { code: '2.2.3', descriptionEn: 'Participation in Volunteer Work', descriptionAr: 'المشاركة في العمل التطوعي' },
            { code: '2.2.4', descriptionEn: 'Practicing Consultation and Electoral Culture', descriptionAr: 'ممارسات الشورى والثقافة الانتخابية' },
          ],
        },
        {
          code: '2.3',
          nameEn: 'Health and Environmental Awareness',
          nameAr: 'الوعي الصحي والبيئي',
          indicators: [
            { code: '2.3.1', descriptionEn: 'Commitment to Healthy and Safe Lifestyles', descriptionAr: 'الالتزام بأنماط الحياة السليمة والصحية' },
            { code: '2.3.2', descriptionEn: 'Participation in Environmental and Climate Issues', descriptionAr: 'المشاركة في قضايا البيئة والمناخ' },
          ],
        },
        {
          code: '2.4',
          nameEn: 'Innovation and Entrepreneurship',
          nameAr: 'الابتكار وريادة الأعمال',
          indicators: [
            { code: '2.4.1', descriptionEn: 'Initiative in Presenting Ideas and Launching Projects', descriptionAr: 'المبادرة في طرح الأفكار وإطلاق المشروعات' },
            { code: '2.4.2', descriptionEn: 'Project Management to Achieve Results', descriptionAr: 'إدارة المشروعات لتحقيق النتائج' },
            { code: '2.4.3', descriptionEn: 'Commitment to Work Ethics', descriptionAr: 'الالتزام بأخلاقيات العمل' },
            { code: '2.4.4', descriptionEn: 'Communication and Team Leadership', descriptionAr: 'التواصل وقيادة الفرق' },
          ],
        },
      ],
    },

    // --- AXIS 2: Quality of School Processes ---
    {
      axisId: axis2.id,
      code: 'D3',
      nameEn: 'Instruction and Assessment',
      nameAr: 'التدريس والتقويم',
      standards: [
        {
          code: '3.1',
          nameEn: 'Curriculum Planning',
          nameAr: 'تخطيط المنهاج الدراسي',
          indicators: [
            { code: '3.1.1', descriptionEn: 'Curriculum Planning to Achieve Learning Goals and Meet Student Needs', descriptionAr: 'تخطيط المنهاج الدراسي لتحقيق الكفايات، وتلبية احتياجات الطلبة' },
            { code: '3.1.2', descriptionEn: 'Linking Study Materials to Support Curriculum Integration', descriptionAr: 'الربط بين المواد الدراسية لدعم التكامل المنهجي و ربط المنهاج بثقافة سلطنة عمان' },
            { code: '3.1.3', descriptionEn: 'Alignment of the Curriculum with the following, considering student needs and differences', descriptionAr: 'مواءمة المنهاج بما يلي احتياجات جميع الطلبة ويراعي التمايز بينهم' },
          ],
        },
        {
          code: '3.2',
          nameEn: 'Classroom Management',
          nameAr: 'إدارة الصف',
          indicators: [
            { code: '3.2.1', descriptionEn: 'Management of Learning Time', descriptionAr: 'إدارة زمن التعلم' },
            { code: '3.2.2', descriptionEn: 'Management of Student Behavior', descriptionAr: 'إدارة سلوك الطلبة' },
            { code: '3.2.3', descriptionEn: 'Arousing Intrinsic Motivation for Learning commensurate with student abilities and maturity', descriptionAr: 'إثارة الدافعية للتعلم بما يتلاءم مع قدرات الطلبة و فئاتهم' },
          ],
        },
        {
          code: '3.3',
          nameEn: 'Effectiveness of Instruction',
          nameAr: 'فاعلية التدريس',
          indicators: [
            { code: '3.3.1', descriptionEn: "Teachers' Presentation of Lesson Content and Use of Learning Strategies", descriptionAr: 'تقديم المعلمين لمحتوى الدروس، واستخدام استراتيجيات التعلم' },
            { code: '3.3.2', descriptionEn: 'Language of Instruction to Facilitate Learning', descriptionAr: 'لغة التدريس لتعزيز التعلم' },
            { code: '3.3.3', descriptionEn: 'Employing Educational Resources and Means, including e-learning programs and platforms', descriptionAr: 'توظيف المصادر والوسائل التعليمية، بما في ذلك برامج التعلم الإلكتروني ومنصاته' },
            { code: '3.3.4', descriptionEn: 'Enabling Students to Express their Opinions, apply what they learned, and learn from their mistakes', descriptionAr: 'تمكين الطلبة من التعبير عن آرائهم، وتطبيق ما تعلموه، والتعلم من أخطائهم' },
            { code: '3.3.5', descriptionEn: 'Alignment of Teaching Strategies with the needs of students with special needs and disabilities', descriptionAr: 'مواءمة استراتيجيات التدريس مع متطلبات ذوي الاحتياجات الخاصة والإعاقة' },
          ],
        },
        {
          code: '3.4',
          nameEn: 'Excellence in Learning Skills',
          nameAr: 'تعزيز مهارات التعلم',
          indicators: [
            { code: '3.4.1', descriptionEn: "Linking Learning with Students' Realities and Lives", descriptionAr: 'ربط التعلم بواقع الطلبة وحياتهم' },
            { code: '3.4.2', descriptionEn: 'Developing the Ability for Inquiry, Critical Thinking, and Reflection beyond the scope of study materials, enabling continuous learning', descriptionAr: 'تعزيز القدرة على التساؤل و التفكير التدبر بما يتعدى مساحة المواد الدراسية و يمكن من مواصلة التعلم' },
            { code: '3.4.3', descriptionEn: 'Promoting Self-Learning and Collaborative Learning Skills', descriptionAr: 'تعزيز مهارات التعلم الذاتي والتعلم التعاوني' },
            { code: '3.4.4', descriptionEn: 'Developing the Spirit of Initiative, Entrepreneurship, and Adaptability to Variables', descriptionAr: 'تنمية روح المبادرة، وتعزيز التكيف مع المتغيرات' },
            { code: '3.4.5', descriptionEn: 'Developing Oral and Calculation Skills, and Promoting Reading Culture', descriptionAr: 'تنمية مهارات التعلم القرائية والحسابية، وتعزيز ثقافة القراءة' },
            { code: '3.4.6', descriptionEn: 'Developing Digital Skills', descriptionAr: 'تنمية المهارات الرقمية' },
          ],
        },
        {
          code: '3.5',
          nameEn: 'Assessment and Support for Progress',
          nameAr: 'التقويم ومساندة التقدم',
          indicators: [
            { code: '3.5.1', descriptionEn: 'Employing Assessment Methods that account for differentiation and achieve learning goals', descriptionAr: 'توظيف أساليب تقويم تراعي التمايز وتضمن تحقق أهداف التعلم' },
            { code: '3.5.2', descriptionEn: 'Applying Assessments according to Approved Standards', descriptionAr: 'تطبيق التقويمات حسب المعايير المعتمدة' },
            { code: '3.5.3', descriptionEn: 'Employing Assessment Results in Support of Learning and Progress', descriptionAr: 'توظيف نتائج التقويم في دعم التعلم والتقدم فيه' },
            { code: '3.5.4', descriptionEn: 'Follow-up in achieving learning goals and providing differentiation among students', descriptionAr: 'متابعة التقدم في تحقيق أهداف التعلم بما يراعي التمايز بين الطلبة' },
          ],
        },
      ],
    },
    {
      axisId: axis2.id,
      code: 'D4',
      nameEn: 'Learning Environment and Outcomes',
      nameAr: 'مناخ المدرسة و بيئة التعلم',
      standards: [
        {
          code: '4.1',
          nameEn: 'Quality of the Learning Environment',
          nameAr: 'جودة بيئة التعلم',
          indicators: [
            { code: '4.1.1', descriptionEn: 'Safety and Security Procedures, and licensing by relevant authorities', descriptionAr: 'تدابير الأمن والسلامة وترخيصها من الجهات المختصة' },
            { code: '4.1.2', descriptionEn: 'Monitoring school facilities, environment, and internal and external areas, including those for students with disabilities', descriptionAr: 'متابعة مرافق المدرسة الجسدية والبيئة الداخلية والمناطق فيها، بمن فيهم ذوو الإعاقة' },
            { code: '4.1.3', descriptionEn: 'Cleanliness of school facilities and surroundings', descriptionAr: 'نظافة مرافق المدرسة و جاذبيتها' },
            { code: '4.1.4', descriptionEn: 'Employing digital assessment and supporting platforms that aid in in-person learning and learning remotely', descriptionAr: 'تجهيز المرافق التعليمية بالوسائط الأمنة المساعدة عالتعلم الحضزري و التعلم عن بعد' },
          ],
        },
        {
          code: '4.2',
          nameEn: 'Enhancing Student Talent',
          nameAr: ' تعزيز مواهب الطلبة و قدراتهم',
          indicators: [
            { code: '4.2.1', descriptionEn: 'A school environment that encourages students to discover their talents, skills, and potential', descriptionAr: 'بيئة مدرسية تشجع على اكتشاف قدرات الطلبة ومواهبهم' },
            { code: '4.2.2', descriptionEn: 'Promoting student talents, skills, and nurturing them in line with their needs and abilities', descriptionAr: 'تعزيز مواهب الطلبة وقدراتهم، والاحتفاء بها وتطويرها بما يتماشى مع رغباتهم واحتياجاتهم ' },
          ],
        },
        {
          code: '4.3',
          nameEn: 'Care and Support',
          nameAr: 'الدعم والرعاية',
          indicators: [
            { code: '4.3.1', descriptionEn: 'Promoting child rights culture', descriptionAr: 'تنمية ثقافة حقوق الطفل' },
            { code: '4.3.2', descriptionEn: "Attention to students' physical and mental health", descriptionAr: 'الاهتمام برعاية الطلبة جسدياً ونفسياً' },
            { code: '4.3.3', descriptionEn: 'Providing care and support to students facing learning difficulties in their education or for other reasons', descriptionAr: 'دعم ورعاية الطلبة الذين يواجهون صعوبات في تعلمهم، لاحتياجاتهم الخاصة أو إعاقتهم أو لأسباب أخرى' },
            { code: '4.3.4', descriptionEn: 'Building research skills and vocational guidance and supporting them in line with labor market trends and requirements', descriptionAr: 'تهيئة الطلبة للمسارات الأكاديمية و المهنية و دعمهم بما يتوافق مع ميولهم و متطلبات سوق العمل' },
            { code: '4.3.5', descriptionEn: 'Guiding students towards their needs and requirements, and preparing them for transitioning to other educational stages', descriptionAr: 'تفهم مراحل نمو الطلبة و متطلباتها و تهيئة الطلبة للانتقال من مرحلة تعليمية الى اخرى' },
          ],
        },
        {
          code: '4.4',
          nameEn: 'Development of Scientific Skills',
          nameAr: 'تنمية مهارات البحث العلمي',
          indicators: [
            { code: '4.4.1', descriptionEn: 'A school environment that encourages scientific research, commitment to ethical standards, and estimation of its value', descriptionAr: 'بيئة مدرسية تشجع على البحث العلمي والالتزام بأخلاقياته' },
            { code: '4.4.2', descriptionEn: 'Role of the school in highlighting scientific and technical outputs and achievements', descriptionAr: 'نهج المدرسة في إبراز الإنتاج البحثي للطلبة وتقديره' },
          ],
        },
      ],
    },

    // --- AXIS 3: Assurance of Learning and School Processes Quality ---
    {
      axisId: axis3.id,
      code: 'D5',
      nameEn: 'Leadership, Administration, and Governance',
      nameAr: 'القيادة والإدارة والحوكمة',
      standards: [
        {
          code: '5.1',
          nameEn: 'Leadership for Change',
          nameAr: 'قيادة التغيير',
          indicators: [
            { code: '5.1.1', descriptionEn: 'Vision and Mission of the school, involvement of the community in their development and implementation', descriptionAr: 'رؤية ورسالة يشارك المجتمع المدرسي في بنائها وتنفيذهما' },
            { code: '5.1.2', descriptionEn: 'Self-evaluation and its use in strategic planning and improving performance', descriptionAr: 'التقويم الذاتي وتوظيفه في التخطيط الاستراتيجي وتحسين الأداء' },
            { code: '5.1.3', descriptionEn: 'Joint and active work and communication with the school community to support improvement processes', descriptionAr: 'العمل المشترك والتواصل الفاعل مع المجتمع المدرسي لدعم عمليات التحسين' },
            { code: '5.1.4', descriptionEn: 'Expectations towards the curriculum, students, and staff', descriptionAr: 'توقعات عالية تجاه العاملين بالمدرسة والطلبة' },
          ],
        },
        {
          code: '5.2',
          nameEn: 'Leadership for Learning and Instruction',
          nameAr: 'قيادة التعليم والتعلم',
          indicators: [
            { code: '5.2.1', descriptionEn: 'School leadership guided by the curriculum, and instructional practices necessary to achieve learning goals', descriptionAr: 'إلمام قيادة المدرسة بالمناهج وممارسات التدريس الضرورية لتحقيق أهداف التعلم' },
            { code: '5.2.2', descriptionEn: 'Supervision of the education and learning process that supports student differentiation and progress', descriptionAr: 'الإشراف على عمليتي التعليم والتعلم بما يدعم تعلم الطلبة ويراعي التمايز بينهم' },
            { code: '5.2.3', descriptionEn: 'Professional growth directed at improving instruction, and raising student performance levels', descriptionAr: 'إنماء مهني للمعلمين موجه لتجويد التدريس، ورفع مستوى أداء الطلبة' },
            { code: '5.2.4', descriptionEn: 'Student involvement in improving the learning process', descriptionAr: 'إشراك الطلبة في تحسين عمليات التعليم' },
            { code: '5.2.5', descriptionEn: 'Formation of professional learning communities within the school and with other schools', descriptionAr: 'تكوين مجتمعات تعلم مهنية داخل المدرسة، ومع المدارس الأخرى' },
          ],
        },
        {
          code: '5.3',
          nameEn: 'Administrative Efficiency',
          nameAr: 'الكفاءة الإدارية',
          indicators: [
            { code: '5.3.1', descriptionEn: 'Management of financial resources to serve the learning of all students', descriptionAr: 'إدارة الموارد المالية بما يخدم تعلم جميع الطلبة' },
            { code: '5.3.2', descriptionEn: 'Optimal use of school facilities and educational resources', descriptionAr: 'الاستخدام الفاعل للمرافق المدرسية والوسائل التعليمية' },
            { code: '5.3.3', descriptionEn: 'Organization of roles and responsibilities', descriptionAr: 'تنظيم الأدوار والمسؤوليات' },
            { code: '5.3.4', descriptionEn: 'Management of human resources and raising their professional efficiency', descriptionAr: 'إدارة الموارد البشرية، ورفع كفاءتها المهنية' },
          ],
        },
        {
          code: '5.4',
          nameEn: 'Partnership with Parents and the Community',
          nameAr: 'الشراكة مع أولياء الأمور والمجتمع',
          indicators: [
            { code: '5.4.1', descriptionEn: 'Involving parents in school life', descriptionAr: 'إشراك أولياء الأمور في الحياة المدرسية' },
            { code: '5.4.2', descriptionEn: "Enabling parents to support their children's learning", descriptionAr: 'تمكين أولياء الأمور من دعم تعلم أبنائهم' },
            { code: '5.4.3', descriptionEn: 'Partnership with community institutions to contribute to the advancement of school life and support learning outcomes', descriptionAr: 'الشراكة مع مؤسسات المجتمع بما يسهم في الارتقاء بالحياة المدرسية ودعم نواتج التعلم' },
          ],
        },
        {
          code: '5.5',
          nameEn: 'Governance',
          nameAr: 'الحوكمة',
          indicators: [
            { code: '5.5.1', descriptionEn: 'Accountability according to roles and responsibilities', descriptionAr: 'المساءلة وفق الأدوار والمسؤوليات' },
            { code: '5.5.2', descriptionEn: 'Application of policies, systems, and organized regulations for work in the school', descriptionAr: 'تطبيق السياسات والأنظمة واللوائح المنظمة للعمل في المدرسة' },
            { code: '5.5.3', descriptionEn: 'Transparency in providing data and ensuring participation', descriptionAr: 'الشفافية في توفير البيانات ومشاركتها' },
          ],
        },
      ],
    },
  ];

  // --- 4. Process the data and create records ---
  for (const domain of domainData) {
    const createdDomain = await prisma.domain.create({
      data: {
        code: domain.code,
        nameEn: domain.nameEn,
        nameAr: domain.nameAr,
        axisId: domain.axisId,
        standards: {
          create: domain.standards.map((standard) => ({
            code: standard.code,
            nameEn: standard.nameEn,
            nameAr: standard.nameAr,
            indicators: {
              create: standard.indicators.map((indicator) => ({
                code: indicator.code,
                descriptionEn: indicator.descriptionEn,
                descriptionAr: indicator.descriptionAr,
              })),
            },
          })),
        },
      },
      include: {
        standards: {
          include: {
            indicators: true,
          },
        },
        axis: true,
      },
    });
    console.log(`✅ Created Domain: ${createdDomain.nameEn} (${createdDomain.code}) under Axis: ${createdDomain.axis.nameEn}`);
  }

  console.log('🎉 Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });