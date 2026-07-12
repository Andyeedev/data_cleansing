
File locations: 

1) Presentation Test Guide - research\Packaging_our_Company\ver2\00_prompts\Batch_18_Presentation_Engine\18_Presentation_Engine_Test_Guide.md

2) output  - research\Packaging_our_Company\ver2\02_output


# MAP Presentation Engine
## Presentation Engine Acceptance Test Guide
Version 1.0

--------------------------------------------------

OBJECTIVE

Create a complete User Acceptance Test (UAT) and System Acceptance Test (SAT) guide for the MAP Presentation Engine.

This guide will be used whenever Modules 01–10 are executed.

It must be reusable and expandable as future modules are added.

The guide should enable someone with no prior knowledge of MAP to verify that every generated output is complete, professional, internally consistent, and ready for external use.

--------------------------------------------------

OUTPUT LOCATION

Create

Presentation_Engine_Test_Guide/

containing

01_Test_Guide.md

02_Test_Checklist.xlsx

03_Test_Report_Template.md

04_Known_Issues.md

05_Test_Log.md

--------------------------------------------------

GENERAL TESTING PRINCIPLES

Always test as an end user.

Never test from a developer perspective.

Assume the reviewer is one of:

• Microsoft Founders Hub
• Enterprise Customer
• CIO
• Investor
• Partner
• Internal Sales Team

--------------------------------------------------

TEST ENVIRONMENT

Record

Date

Tester

Version

Operating System

Browser

Resolution

Internet Connected (Yes/No)

Output Folder Tested

--------------------------------------------------

MODULE TESTS

Create a separate section for each module.

--------------------------------------------------

MODULE 01

Purpose

Expected Output

Output Folder

Files Expected

How to Open

How to Test

What Good Looks Like

Common Problems

Pass / Fail Checklist

--------------------------------------------------

MODULE 02

Repeat

--------------------------------------------------

MODULE 03

Purpose

Enterprise Demo Package

Expected Folder

Demo_Package/

Verify

Launch_MAP.html

Landing Page

Navigation

Executive Dashboard

Migration Overview

Validation Centre

Governance Centre

Risk Assessment

Data Quality

Reports

About MAP

Test

Open Launch_MAP.html

Verify landing page loads.

Click every navigation tile.

Verify every page opens.

Verify browser works using

Edge

Chrome

Firefox

Disconnect Internet.

Verify demo still works.

Check

No localhost

No VS Code

No developer messages

No PostgreSQL

No broken links

No missing charts

No missing assets

Pass / Fail

--------------------------------------------------

MODULE 04

Purpose

Media Pack

Verify

Media/

Hero

Website

Brochure

LinkedIn

Documentation

Pitch Deck

Cards

Check

Images exist

High resolution

Professional layout

Azure colours

MAP branding

No browser chrome

No developer artefacts

Pass / Fail

--------------------------------------------------

MODULE 05

Purpose

Product Brochure

Verify

Brochure opens

Cover page

Problem

Solution

Benefits

Roadmap

Architecture

Screenshots

Azure Alignment

Call to Action

Check

Suitable for CIO

Suitable for Microsoft

Suitable for Customer

--------------------------------------------------

MODULE 06

Purpose

Investor Pack

Verify

Executive Summary

Problem

Market

Business Model

Founder

Roadmap

Investment Ask

Check

Professional

Clear

Investor Ready

--------------------------------------------------

MODULE 07

Purpose

Sales Demonstration

Verify

Sales narrative

Customer journey

Value proposition

Objection handling

Business outcomes

Call to Action

--------------------------------------------------

MODULE 08

Purpose

Website Content

Verify

Homepage

About

Product

Features

Solutions

Contact

Check

Readable

Consistent

Professional

SEO-friendly

--------------------------------------------------

OUTPUT ACCESS

For every module include

Folder Location

Files

Primary File

Supporting Files

Recommended Browser

Recommended Viewer

Example

Module 03

Folder

Demo_Package/

Open

Launch_MAP.html

using

Microsoft Edge

--------------------------------------------------

GLOBAL TESTS

After module testing perform

Brand Review

Verify

MAP logo

Azure palette

Segoe UI

Consistent colours

Consistent spacing

--------------------------------------------------

Terminology Review

Verify consistent use of

MAP Nexus™

Migration Readiness

Validation Centre

Governance Centre

Migration Status

Executive Dashboard

Never use

Issue Dashboard

Pipeline Blocked

Developer wording

--------------------------------------------------

Search Review

Search all generated files for

localhost

postgres

password

debug

TODO

developer

VS Code

terminal

sample

example

placeholder

lorem

Record findings.

--------------------------------------------------

Consistency Review

Verify

Mission

Vision

Founder

Azure positioning

Roadmap

Business model

Problem statement

Solution statement

are identical across all modules.

--------------------------------------------------

Performance Review

Measure

Landing page load

Dashboard load

Report load

Browser responsiveness

--------------------------------------------------

Professional Review

Ask

Would Microsoft approve this?

Would I send this to a customer?

Would I present this to a CIO?

Would I show this to investors?

--------------------------------------------------

TEST REPORT

Automatically generate

Presentation_Engine_Test_Report.md

Including

Modules Tested

Modules Passed

Modules Failed

Issues Found

Recommendations

Overall Readiness Score

Ready for Release

Yes / No

--------------------------------------------------

CHECKLIST

Generate a master checklist with

Module

Status

Tester

Date

Issues

Resolved

Suitable for repeated execution.

--------------------------------------------------

FUTURE EXPANSION

Design the guide so Modules 09, 10 and future modules can be added without changing existing numbering.

--------------------------------------------------

FINAL QUALITY REVIEW

Verify

Guide is reusable.

Guide is complete.

Guide is suitable for non-technical users.

Guide supports UAT and SAT.

Guide can be used before every Presentation Engine release.