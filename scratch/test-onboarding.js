const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const userId = "test-user-id";
    const data = {
      userId,
      professionCategory: "Developer",
      personalInfo: { fullName: "Test User" },
      summary: "Test",
      skills: [{ name: "Test" }],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      publications: [],
      workSamples: [],
      confirmed: true,
      premiumCredits: 0,
      professionalBlueprint: {},
      extensions: {}
    };

    console.log("Saving career profile...");
    await prisma.careerProfile.upsert({
      where: { userId },
      update: {
        professionCategory: data.professionCategory,
        personalInfo: data.personalInfo,
        summary: data.summary,
        skills: data.skills,
        experience: data.experience,
        projects: data.projects,
        education: data.education,
        certifications: data.certifications,
        achievements: data.achievements,
        publications: data.publications,
        workSamples: data.workSamples,
        confirmed: data.confirmed,
        premiumCredits: data.premiumCredits,
        professionalBlueprint: data.professionalBlueprint,
        extensions: data.extensions,
      },
      create: {
        userId,
        professionCategory: data.professionCategory,
        personalInfo: data.personalInfo,
        summary: data.summary,
        skills: data.skills,
        experience: data.experience,
        projects: data.projects,
        education: data.education,
        certifications: data.certifications,
        achievements: data.achievements,
        publications: data.publications,
        workSamples: data.workSamples,
        confirmed: data.confirmed,
        premiumCredits: data.premiumCredits,
        professionalBlueprint: data.professionalBlueprint,
        extensions: data.extensions,
      }
    });
    console.log("Profile saved.");
    
    console.log("Saving portfolio...");
    const portfolio = {
      userId,
      templateId: 'dev',
      customAccentColor: null,
      visibility: 'public',
      subdomain: 'testuser',
      sectionToggles: {},
      sectionOrder: [],
      sectionTitles: {},
      enhancements: {}
    };
    await prisma.portfolio.upsert({
      where: { userId },
      update: {
        templateId: portfolio.templateId,
        customAccentColor: portfolio.customAccentColor,
        visibility: portfolio.visibility,
        subdomain: portfolio.subdomain,
        sectionToggles: portfolio.sectionToggles,
        sectionOrder: portfolio.sectionOrder,
        sectionTitles: portfolio.sectionTitles,
        enhancements: portfolio.enhancements,
      },
      create: {
        userId,
        templateId: portfolio.templateId,
        customAccentColor: portfolio.customAccentColor,
        visibility: portfolio.visibility,
        subdomain: portfolio.subdomain,
        sectionToggles: portfolio.sectionToggles,
        sectionOrder: portfolio.sectionOrder,
        sectionTitles: portfolio.sectionTitles,
        enhancements: portfolio.enhancements,
      }
    });
    console.log("Portfolio saved.");

    console.log("Testing Interview Questions...");
    const questions = [
      { userId, question: "Test?", type: "technical", contextRef: "Test", suggestedPoints: [], premiumAnswer: "" }
    ];
    await prisma.interviewQuestion.createMany({
      data: questions.map(q => ({
        userId: q.userId,
        question: q.question,
        type: q.type,
        contextRef: q.contextRef,
        suggestedPoints: q.suggestedPoints,
        premiumAnswer: q.premiumAnswer,
      }))
    });
    console.log("Interview questions saved.");

  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
