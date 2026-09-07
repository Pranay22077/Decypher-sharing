Overall idea
The basic idea is to make one complete platform for investigators where all the scattered information of a case can be brought together and viewed in one place + interlinked to different cases
Instead of FIRs, call records, financial records, CCTV, audio, reports, locations, vehicles etc being checked separately, the system connects all of them and builds one overall picture of the investigation
The main goal is basically
collect information → organize it → connect it → analyse it → show useful leads → let investigator verify everything using the original evidence
1. Login and User Roles
A secure login screen
Different types of users can have different access
Investigator
Senior Investigator
Forensics
Admin
The access to cases, evidence and sensitive information can depend on the role
2. Command Center / Dashboard
After login, investigator sees a main dashboard
It can show
active cases
recently updated cases
pending evidence processing
important alerts
things needing review
recent activity
new information added to cases
Basically this becomes the starting point for the investigator
3. Case Management
Investigator can create a new case or open an existing case
While creating a case, basic details can be added like
case name
case type
description
date
location
priority
assigned team
After opening a case, the main case page can show everything related to that investigation
people, phones, vehicles, locations, transactions, documents, videos, audio, reports, alerts, related cases etc
4. Upload and Add Evidence
Investigator can upload different types of information into the case
for example
FIRs
police reports
call records
transaction data
images
CCTV videos
audio recordings
documents
intelligence reports
public web information
The idea is that investigator doesn't have to separately organize every source manually
5. Evidence Processing
After upload, we can show the complete processing flow
uploading → securing → reading → extracting information → finding entities → finding relationships → analysing
For example, from one report the system can find
person names
phone numbers
vehicle numbers
locations
dates
organizations
important events
Then these can be connected with the already existing case information
For the prototype this can be mostly hardcoded but the flow should look like the real system
6. Master Investigation Graph
This is one of the main features
The system creates a large interactive graph of the case
Nodes can represent
people
phones
vehicles
locations
organizations
bank accounts
social accounts
cases
events
Connections can represent
calls
meetings
financial transactions
shared locations
vehicle usage
working relationships
appearing in the same report
appearing in the same media
links between cases
Investigator can
zoom in/out
drag nodes
expand connections
hide certain types of relationships
focus on a particular person or group

7. Different Graph Views
The same data can be viewed in different ways
All relationships
Communication network
Financial network
People network
Case connections
Location based network
This makes it easier to focus on one type of information instead of seeing everything at once

8. Person 360 / Dossier
Clicking a person in the graph opens their complete profile
This can include
photo
name
aliases
phone numbers
vehicles
locations
organizations
associated people
cases
financial activity
communication activity
documents where they appear
images/videos where they appear
important events
alerts
complete timeline
Basically everything known about that person from the current investigation in one place

9. Why is this Person Important
For important nodes in the graph, the system can explain why they were highlighted
For example
very high number of connections
connects two separate groups
appears in multiple cases
high communication activity
high financial activity
involved in many important events
This should be shown as network importance / investigative lead and not as a direct statement that the person is guilty

10. Relationship Investigation
Investigator can click a connection between two people
Then the system shows why they are connected
For example
12 calls between them
1 financial transaction
seen around the same location
same vehicle appeared in records
both mentioned in a report
Then investigator can directly open the evidence supporting that relationship
There can also be a simple option like
"Why are these two connected?"
which gives the explanation and supporting evidence

11. Investigation Timeline
A complete timeline of the case
It can show
calls
transactions
meetings
vehicle sightings
location events
crimes
reports
media events
other important events
Clicking an event opens its details and source
There can also be an "Around This Event" view
For example, if an important transaction happened at 8:30 PM, the investigator can see what happened around that time
who was communicating
which vehicles were nearby
who was at the location
what other events happened

12. Map / Location Analysis
A map showing important locations related to the investigation
For example
crime locations
homes
meeting locations
vehicle sightings
phone activity locations
other important places
Time filters can be used to see where different people or vehicles were at different times

13. Financial Analysis
A separate financial investigation view
It can show how money moves between people and accounts
For example
Person A → Account B → Person C
Investigator can trace money forward or backward
Large or unusual transactions can be highlighted
Each transaction should also have its source information

14. Communication Analysis
A communication section showing
who talks to whom
number of calls
frequency
new phone numbers
communication bursts
unusual communication patterns
This can also connect directly back to the main graph
15. Intelligence Alerts
The system can automatically highlight things that may need investigation
Examples
sudden increase in calls
unusually large transaction
new phone number
new vehicle
new connection between two groups
same person appearing in multiple cases
unusual activity at a location
The important part is that every alert should also have a "Why flagged?" explanation
For example
normal activity = around 5 calls/day
observed activity = 60 calls/day
so the system highlights it for review
16. Evidence Library
A common evidence section for the whole case
Different filters can be used
evidence type
date
source
person
vehicle
location
case
It can contain
documents
FIRs
images
videos
audio
structured data
web sources
reports
etc

17. FIR and Document Intelligence
Investigator can upload an FIR or other report
The system extracts useful information from it
people
locations
phone numbers
vehicles
dates
organizations
important events
It can also create a short summary
The extracted entities can then be added directly to the investigation graph
18. Document Viewer
Document can be shown on one side
Extracted information on the other side
Clicking an entity can show exactly where it appears in the document
Then investigator can choose
"View in Graph"
and directly see how that information connects with the rest of the case

19. Video Evidence
CCTV or other video evidence can be uploaded
The system can identify possible
people
vehicles
events
important timestamps
There can be a video timeline showing important moments
For example
00:32 vehicle enters
01:15 person appears
02:40 vehicle leaves
These detected objects/events can then be linked to the investigation graph
20. Audio Evidence
For audio files, the system can show
transcript
speaker segments
timestamps
detected names
locations
important terms
Important entities can then be linked back to the case graph
21. Possible Person / Vehicle Matching
Images and videos can be compared with people or vehicles already present in the case
The result should be shown as a possible match with confidence
For example
Possible match → 87%
Source → CCTV video
Timestamp → 21:43
This should still require human verification before being treated as confirmed
22. OSINT / Public Information
A section for public information from the web
Investigator can search or add useful public sources
The system can show
source
date
relevance
extracted entities
related cases
Useful information can then be added to the investigation and connected with the graph
23. Similar Cases
Investigator can select a case and search for historical cases that look similar
Similarity can be based on things like
people
locations
vehicles
crime type
network structure
communication patterns
financial patterns
This can help investigators find connections that may not be obvious from one case alone
24. Cross Case Connections
If the same
person
phone
vehicle
location
organization
appears in multiple cases
the system can highlight it
Investigator can then open a combined graph and see what is connecting the cases
25. Historical Pattern Matching
A feature like
"Have we seen this pattern before?"
The system can look at older investigations and identify similar patterns
For example
same type of vehicle movement
similar communication pattern
similar network structure
similar financial movement
This is mainly for helping investigators explore previous cases
26. Information Gaps
A section showing what is still unknown
For example
unknown person
unknown vehicle owner
unverified phone
missing timeline information
missing evidence
uncertain relationship
This gives the investigator an idea of what still needs to be checked
27. Contradiction Center
Sometimes different sources may give different information
For example
Report 1 → person was in Delhi
Report 2 → person was in Mumbai
Instead of automatically selecting one, the system shows both
source 1
source 2
conflict
needs review
This makes the system more realistic and prevents uncertain information from being treated as fact
28. Evidence Confidence
Important relationships and findings can show their confidence / status
For example
Relationship → Probable
Supported by → 3 sources
Contradicted by → 1 source
Status → Needs verification
This gives investigators a better idea of how reliable a particular finding is
29. What Changed
Whenever new information is added to a case, investigator can see what changed since their last review
For example
2 new people
3 new relationships
1 new vehicle
5 new transactions
2 new alerts
1 new related case
This saves the investigator from manually checking the entire case again
30. Network Evolution / Time Machine
A timeline slider can show how the network changed over time
For example
January → small network
February → new person appears
March → new group connection
April → new financial relationship
This gives a view of how the investigation network developed
31. Network Roles
The system can identify useful network roles
For example
bridge person
highly connected person
high communication activity
highly financially connected
peripheral node
These are network-analysis results that help investigators decide where to look next
32. Investigate Mode
Instead of opening separate pages again and again, investigator can select one person/event and enter an investigation workspace
Different panels can show
profile
network
timeline
map
evidence
finance
communication
alerts
all together
33. Focus Mode
The graph can become very large
Focus mode can hide unrelated information and only show
selected person
important connections
related events
supporting evidence
This makes the graph easier to understand
34. Evidence Board
Investigator can create their own working board
They can pin
people
documents
video frames
transactions
locations
events
notes
screenshots
Then arrange and connect them manually
This can work like a digital investigation board
35. Watchlist and Bookmarks
Investigator can bookmark important
people
vehicles
cases
relationships
evidence
They can also watch important objects and get updates when something changes
36. Investigation Queue
The system can suggest things that may need attention next
for example
review contradiction
verify possible identity match
check unusual transaction
review new relationship
investigate new case connection
check missing information
Basically a list of possible next investigation steps
37. Case Copilot
An AI assistant specifically for the selected case
Investigator can ask normal questions like
"Who is connected to this person?"
"Why is this person important?"
"What changed recently?"
"Show transactions between these people"
"What evidence supports this relationship?"
"Which cases are connected?"
"Have we seen this pattern before?"
"What information is still missing?"
The answer should also show the source/evidence behind it
for example
answer
supporting evidence
view graph
view timeline
view original source
38. Explain Feature
Almost every important result can have an "Explain" button
For example
Explain this alert
Explain this relationship
Explain why this person is highlighted
Explain this score
Explain why these cases are connected
The system can give a simple explanation along with the underlying evidence and uncertainty
39. Evidence Chain / Provenance
One important feature is being able to trace any finding back to its original source
something like
Finding → Relationship → Event → Evidence → Original File → Integrity Verification
So the investigator can always understand how the system reached a particular result
40. Evidence Security and Verification
When evidence is uploaded
the system can
assign an evidence ID
create a hash
securely store the original
record who uploaded it
record when it was uploaded
record access history
record important custody events
The verification page can show
original hash
current hash
verified / mismatch
last verification
access history
chain of custody
41. Blockchain / Tamper Verification
Blockchain can be used only for important integrity and custody information
The actual video/document should remain in secure storage
The blockchain/ledger can store things like
evidence ID
hash
timestamp
custody events
important approvals
If evidence changes, the system can detect a hash mismatch and flag it
42. Restricted Evidence Access
Some evidence can require approval before opening
Flow can be
investigator requests access → supervisor approves → access granted → action recorded
Useful for highly sensitive evidence
43. Audit Log
Complete record of important system activity
for example
who uploaded evidence
who viewed it
who changed case information
who approved access
who shared information
who generated a report
This helps with accountability and security
44. Cross Agency Collaboration
An advanced feature where multiple agencies can work on the same investigation
Shared information can have permissions
some information can be openly shared
some can require access requests
some sensitive information can stay restricted
45. Report Generation
Finally, investigator can generate a complete investigation report
It can include
case overview
important people
network graph
timeline
financial analysis
location analysis
alerts
related cases
evidence
investigator notes
important findings
The report can then be previewed in a professional format
Overall User Flow
Login
↓
Command Center
↓
Create / Open Case
↓
Upload FIR + reports + calls + transactions + images + videos + audio etc
↓
System secures and processes the data
↓
Entities and events are extracted
↓
Relationships are created
↓
Master Investigation Graph is generated
↓
Investigator explores the graph
↓
Clicks an important person
↓
Person 360 / Dossier opens
↓
Checks their network + timeline + communications + finances
↓
Finds an important relationship
↓
Opens supporting evidence
↓
Checks CCTV / audio / documents
↓
Possible vehicle/person match is found
↓
Connection is added to the graph
↓
System highlights unusual activity
↓
Investigator clicks "Why flagged?"
↓
Checks evidence and confidence
↓
Looks at related historical cases
↓
Finds cross-case connections
↓
Checks contradictions and missing information
↓
Uses Case Copilot to ask questions
↓
Gets evidence-backed answers
↓
Verifies important evidence and chain of custody
↓
Adds key findings to Evidence Board
↓
Generates investigation report
↓
New evidence comes later
↓
System processes it
↓
"What Changed?" shows the new information
↓
Investigator continues the investigation

Main idea of the whole product
The main thing we are trying to show is that this is not just an AI chatbot or just a graph visualization
it is one complete investigation system where
data → evidence → entities → events → relationships → graph → analysis → insights → investigator review → report
and everything should always be connected back to the original evidence
The investigator should be able to move naturally between
person → graph → relationship → event → timeline → map → evidence → source → related case → analysis → copilot
without losing the context of the case

