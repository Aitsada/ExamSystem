Analyze the entire repository.

Your goal is NOT to explain the source code only.

Your goal is to create a complete technical documentation that will later be used to write a Cooperative Education Report (Internship Report).

Read the whole project and understand how the system actually works.

The output should be a Markdown document called:

COOP_PROJECT_ANALYSIS.md

The document must contain the following sections.

# 1. Project Information

- Project Name
- System Objective
- Problem Statement
- Background
- Target Users
- Main Features

Explain in formal academic language.

--------------------------------------------

# 2. Functional Scope

Describe everything the system can do.

Separate by modules.

Example

- User Management
- Authentication
- Dashboard
- Import Excel
- Room Management
- Seat Allocation
- Report Generation
- etc.

For each module explain

- Purpose
- User
- Workflow
- Important logic

--------------------------------------------

# 3. Technical Architecture

Describe

Frontend

Backend

Database

External Services

Libraries

Frameworks

Why each technology is used.

--------------------------------------------

# 4. Folder Structure

Explain every important folder.

Explain the responsibility of each folder.

--------------------------------------------

# 5. Database Analysis

Explain every table / collection.

Include

Purpose

Relationships

Important fields

Primary Key

Foreign Key

Business meaning

--------------------------------------------

# 6. API Analysis

For every endpoint explain

Method

URL

Purpose

Authentication

Request

Response

Which frontend page uses it

--------------------------------------------

# 7. Authentication

Explain

Login Flow

JWT

Middleware

Permission

Role

--------------------------------------------

# 8. Business Logic

Explain every important algorithm.

Examples

Seat Allocation

Import Excel

Validation

Duplicate Prevention

Room Capacity Checking

Anything important.

Explain WHY it exists.

--------------------------------------------

# 9. User Workflow

Describe how users use the system.

Step-by-step.

From login until finishing work.

--------------------------------------------

# 10. Development Process

Infer the SDLC used.

Explain

Planning

Analysis

Design

Implementation

Testing

Deployment

Maintenance

Use evidence from the repository.

--------------------------------------------

# 11. Diagrams to Create

Based on the repository describe diagrams that should appear in the report.

Include

Use Case Diagram

ER Diagram

Sequence Diagram

Activity Diagram

Class Diagram

System Architecture Diagram

Data Flow Diagram

For each diagram explain

- Why it is needed
- What entities should appear
- Relationships

--------------------------------------------

# 12. Screenshots Needed

List every important page.

Explain

- Screenshot title
- Why it should appear
- Which chapter it belongs to

--------------------------------------------

# 13. Report Writing Notes

For every chapter of a cooperative education report, explain which information from this project belongs there.

Chapter 1 Background

Chapter 2 Theory

Chapter 3 SDLC

Chapter 4 Results

Chapter 5 Conclusion

--------------------------------------------

# 14. Appendix Suggestions

Suggest

API documentation

Database schema

Environment variables

Installation

User manual

--------------------------------------------

# 15. Missing Information

If information cannot be inferred from the repository, list it separately instead of inventing it.

--------------------------------------------

Important Rules

- Never invent information.
- Base every explanation on the repository.
- Explain as if writing documentation for another software engineer.
- Use Markdown headings.
- Use Mermaid diagrams whenever possible.
- The document should be detailed enough that another AI can later write the entire cooperative education report without reading the source code again.


--------------------------------------------

Create a new file in the repository root named:

COOP_PROJECT_ANALYSIS.md

Write the complete documentation into that file.

Language Requirements

- Generate the entire documentation in Thai.
- Use formal academic Thai suitable for a university cooperative education report.
- Keep technical terms in English when they are standard software engineering terminology.
  Examples:
  - Frontend
  - Backend
  - API
  - Database
  - JWT
  - Node.js
  - Vue.js
  - Express.js
  - Docker
  - RESTful API
- Do not translate framework or library names.
- Explain technical concepts in Thai.
- Write as if preparing material for a Thai university cooperative education report.