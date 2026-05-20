import { Gavel, Vote, UsersRound, Newspaper, Shuffle } from "lucide-react";

export const agendaItems = [
  {
    title: "No Post-Retirement Rewards For Judges",
    icon: Gavel,
    demand: "A publicly circulating demand to restrict post-retirement appointments or rewards for judges.",
    concern:
      "People are discussing judicial independence, public trust, and whether future appointments can create perceived conflicts.",
    context:
      "CWI treats this as a serious institutional debate requiring constitutional and legal context, not a simplified slogan.",
    openQuestion:
      "What reforms can strengthen independence while respecting constitutional process?"
  },
  {
    title: "Protect Every Legit Vote",
    icon: Vote,
    demand: "A demand that legitimate voters should not be deleted, suppressed, or blocked from democratic participation.",
    concern:
      "Voting rights are central to public trust. Deletion concerns matter, but specific claims must be verified with evidence.",
    context:
      "CWI can document reported concerns and explain process, but legal claims require careful source verification.",
    openQuestion:
      "How can voter rolls stay accurate without excluding legitimate citizens?"
  },
  {
    title: "50% Reservation For Women",
    icon: UsersRound,
    demand: "A representation demand focused on women's equal share in public decision-making.",
    concern:
      "Youth are discussing gender equality, leadership access, safety, dignity, and meaningful representation.",
    context:
      "CWI frames this as public-interest policy debate with social urgency and implementation complexity.",
    openQuestion:
      "What design makes representation effective beyond symbolic numbers?"
  },
  {
    title: "Independent Media, Not Godi Media",
    icon: Newspaper,
    demand: "A demand for media independence, transparency, and public-interest journalism.",
    concern:
      "Media ownership, advertiser pressure, political proximity, and correction standards affect public trust.",
    context:
      "CWI avoids unverified accusations against individuals and focuses on systems, transparency, and accountability.",
    openQuestion:
      "What public standards can make media independence measurable?"
  },
  {
    title: "20-Year Ban On Political Defection",
    icon: Shuffle,
    demand: "A demand to impose severe consequences on elected representatives who defect after receiving votes.",
    concern:
      "Voters feel betrayed when mandates shift after elections. Defection is a democratic accountability issue.",
    context:
      "CWI presents this as a legal and policy debate that needs constitutional scrutiny and practical design.",
    openQuestion:
      "How can law prevent betrayal without freezing legitimate dissent?"
  }
] as const;
