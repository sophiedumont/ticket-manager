db.createUser(
  {
    user: "sophie",
    pwd: "ticket",
    roles:[
      {
        role: "readWrite",
        db:   "ticket-manager"
      }
    ]
  }
);