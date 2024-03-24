export default class AppConstants {
  public static readonly AppTitle = "Job Down | Application Tracker";

  public static readonly JobStatuses = [
    {
      id: "applied",
      label: "Applied",
    },
    {
      id: "phone_screen",
      label: "Phone Screen",
    },
    {
      id: "coding_challenge",
      label: "Coding Challenge",
    },
    {
      id: "first_interview",
      label: "First Interview",
    },
    {
      id: "second_interview",
      label: "Second Interview",
    },
    {
      id: "final_interview",
      label: "Final Interview",
    },
    {
      id: "offer",
      label: "Offer",
    },
    {
      id: "rejected",
      label: "Rejected",
    },
  ];

  public static readonly DisabledJobStatuses = "rejected";
}
