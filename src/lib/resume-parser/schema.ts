import { z } from 'zod';

export const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().describe("Full name of the candidate"),
    email: z.string().describe("Email address"),
    phone: z.string().describe("Phone number"),
    location: z.string().describe("City, State, or Country"),
    github: z.string().describe("GitHub profile URL"),
    linkedin: z.string().describe("LinkedIn profile URL"),
    website: z.string().describe("Personal website or portfolio URL"),
  }),
  summary: z.string().describe("Professional summary or objective statement"),
  skills: z.array(
    z.object({
      name: z.string().describe("Name of the skill (e.g. React, Python, Communication)"),
    })
  ).describe("List of technical and soft skills"),
  education: z.array(
    z.object({
      institution: z.string().describe("Name of the university or school"),
      degree: z.string().describe("Degree obtained (e.g. B.S., Master, PhD)"),
      specialization: z.string().describe("Major or field of study"),
      startYear: z.string().describe("Start year or date"),
      endYear: z.string().describe("Graduation year or expected graduation"),
      cgpa: z.string().describe("Grade or GPA"),
      location: z.string().describe("Location of the institution"),
      year: z.string().describe("Graduation year"),
    })
  ).describe("Educational background"),
  experience: z.array(
    z.object({
      company: z.string().describe("Name of the company or organization"),
      position: z.string().describe("Job title or role"),
      startDate: z.string().describe("Start date"),
      endDate: z.string().describe("End date or 'Present'"),
      currentlyWorking: z.boolean().describe("True if currently working here"),
      description: z.string().describe("Full description of the role, including all bullet points"),
      achievements: z.array(z.string()).describe("Specific accomplishments or bullet points"),
      location: z.string().describe("Location of the job"),
    })
  ).describe("Work experience history"),
  projects: z.array(
    z.object({
      name: z.string().describe("Name of the project"),
      technologies: z.array(z.string()).describe("Technologies used in the project"),
      description: z.string().describe("Full description of the project"),
      problemSolved: z.string().describe("The core problem the project solved"),
      impact: z.string().describe("The impact or outcome of the project"),
      githubUrl: z.string().describe("GitHub repository URL"),
      liveUrl: z.string().describe("Live project URL"),
    })
  ).describe("Notable projects"),
  certifications: z.array(
    z.object({
      title: z.string().describe("Name of the certification"),
      issuer: z.string().describe("Organization that issued the certification"),
      issueDate: z.string().describe("Date of issue"),
      credentialUrl: z.string().describe("URL to verify the credential"),
    })
  ).describe("Certifications and licenses"),
  achievements: z.array(
    z.object({
      title: z.string().describe("Title of the achievement or award"),
      description: z.string().describe("Description of the achievement"),
    })
  ).describe("Awards, honors, and achievements"),
});
