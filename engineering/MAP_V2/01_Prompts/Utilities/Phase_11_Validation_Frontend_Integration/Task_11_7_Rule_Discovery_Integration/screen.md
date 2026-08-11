

Current Page (Single Table):
[FILTER: Search] [Status: all] [Severity: all]
           ↓
    Single Table (rules list)
Proposed (Two Trees with Shared Filters):
[FILTER: Search "orders"] [Dataset: sales.orders] [Control: C01] [Status: enabled]
           ↓                        ↓
   ┌─────────────────┐    ┌──────────────────────────────────┐
   │  RULE TREE      │    │  Discovered Rules                │
   │  [C01] (2/5 shown) │   ┌────────────────────────────────┐ │
   │   ├── C01_ROWCOUNT │   │ Rule | Dataset | Status        │ │
   │   └── C04_COLUMN   │   └────────────────────────────────┘ │
   │  [C02] (0/3 shown) │                                        │
   └─────────────────┘    ┌──────────────────────────────────┐
                          │  MAPPINGS TABLE                   │
                          │  ┌──────────────────────────────┐ │
                          │  │ Dataset | Rule | SQL Template│ │
                          │  └──────────────────────────────┘ │
                          └──────────────────────────────────┘

                          
Instead of tabs, we could use the existing SplitPane concept but restructured:
┌─────────────────────────────────────────────────────┐
│ Project ID: [input] [Trigger Discovery]            │
│ [Total Mappings] [Rules Discovered] [Last Discovery]│
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ Discovered Rules (Tree by Control)             │ │
│ │ ┌──────┬──────────────────────────────────────┐ │ │
│ │ │Tree  │  Rules Table                         │ │ │
│ │ │[C01] │ Rule ID | Name | Dataset | Status    │ │ │
│ │ │[C02] │                            [Pagination]│ │ │
│ │ └──────┴──────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Rule-to-Dataset Mappings (Tree by Dataset)     │ │
│ │ ┌──────┬──────────────────────────────────────┐ │ │
│ │ │Tree  │  Mappings Table                       │ │ │
│ │ │[sales] │ Mapping ID | Rule | Rule Name | SQL│ │ │
│ │ │[hr]    │                              [Pagination]│ │ │
│ │ └──────┴──────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘