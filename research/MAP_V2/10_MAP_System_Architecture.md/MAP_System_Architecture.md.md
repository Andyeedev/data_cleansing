


Three separate systems
┌────────────────────────────────────────────────────────────┐
│                 MAP V2 React Frontend                      │
│                                                            │
│ Executive Portal                                           │
│ Migration Portal                                           │
│ Reporting Portal                                           │
│ AI Portal                                                  │
│ Workflow                                                   │
│ Administration                                              │
└────────────────────────────┬───────────────────────────────┘
                             │
                    REST / WebSocket API
                             │
┌────────────────────────────▼───────────────────────────────┐
│                Python Application Layer                    │
│                                                            │
│ FastAPI                                                    │
│ Authentication                                             │
│ Workflow Engine                                            │
│ AI Engine                                                  │
│ Reporting Engine                                           │
│ Notification Engine                                        │
│ Existing Validation Engine                                 │
└────────────────────────────┬───────────────────────────────┘
                             │
                    SQLAlchemy / Services
                             │
┌────────────────────────────▼───────────────────────────────┐
│                    PostgreSQL Database                     │
│                                                            │
│ core schema                                                │
│ engine schema                                              │
│ platform schema                                            │
└────────────────────────────────────────────────────────────┘



Where the problem really is

The problem isn't the database.

The problem isn't React.

The problem isn't Python.

The missing piece is the Application Layer.

When we started the project, the Python application was written as a CLI engine.

python -m app.main run --config config.yaml

That engine assumes:

config.yaml

↓

Batch Runner

↓

Validation Engine

↓

Database

Your React application assumes:

User clicks button

↓

API

↓

Python

↓

Database

Those are two completely different execution models.


The real issue

The frontend currently knows how to display:

Migration dashboards
Rules
Controls
AI
Reports
Workflow
Governance

But it has nothing to talk to.

Meanwhile Python already knows everything about:

Rule discovery
Control execution
Governance
Reporting
Metadata
Dataset mappings

but it exposes almost none of it through REST.

So what should happen?

The React frontend must never connect directly to PostgreSQL.

Instead it should always go through Python.

React

↓

GET /api/v1/dashboard

↓

Python

↓

core + engine + platform

↓

JSON

↓

React
Therefore MAP now needs a contract

This is what I think is missing.

Not another workstream.

A Platform Contract.

Something like

Frontend

↓

API Contract

↓

Application Services

↓

Repositories

↓

Database

Every feature should pass through this pipeline.

Example

Today

Dashboard wants

Number of Rules

Number of Controls

Last Run

Governance Status

React currently has nowhere to get it.

Instead

GET /api/v1/dashboard/executive

Python should return

{
   batches,
   controls,
   governance,
   reports,
   ai,
   notifications,
   workflow
}

React never needs to know the database exists.

Likewise AI

Current

React

↓

Chat Window

Should become

React

↓

POST /api/v1/ai/chat

↓

Python

↓

Configured Provider

↓

Response
Likewise Workflow
React

↓

POST /api/v1/workflows/start

↓

Python

↓

Workflow Engine

↓

Database
Likewise Reports
React

↓

POST /api/v1/reports/generate

↓

Python

↓

Reporting Engine

↓

PDF

↓

Download
What I think is missing

Not more prompts.

Not more frontend.

Not more database.

The missing layer is this:

Application Services

Today you have

React

Database

with a CLI engine sitting beside it.

You actually need

React

↓

REST API

↓

Application Service Layer

↓

Existing Validation Engine

↓

Repositories

↓

Database

Notice something important:

We're not replacing the Validation Engine.

We're wrapping it.

That protects all the work you've already invested.

I think this should now become MAP's highest priority

Before implementing any more portals or AI providers, I would focus on creating an API Integration Layer.

This layer would:

expose the existing Python engine as REST APIs,
provide services that orchestrate existing business logic,
hide the database from the frontend,
become the single contract between React and Python.

That isn't a sign the project is in trouble—it's the natural next step. You've successfully built the UI and the core engine independently. Now it's time to connect them through a well-defined application layer instead of letting the frontend or database know about each other directly.

In fact, I'd consider this the point where MAP stops being "a frontend plus a backend" and becomes a true enterprise platform with clear boundaries between presentation, application, and data layers.


My recommendation

I would not jump straight into building APIs.

I would first produce what enterprise architects call:

Platform Integration Architecture

This becomes Architecture Document 13.

For example:

00_Architecture/

13_Platform_Application_Architecture.md

or

13_Platform_Integration_Architecture.md

This document becomes the contract for the next 2–3 years.

Then, after approval

Everything else becomes straightforward.

React
        ↓
API
        ↓
Application Services
        ↓
Existing Python Engine
        ↓
Repositories
        ↓
PostgreSQL

Notice something.

We're not replacing anything.

We're simply inserting the missing layer.