import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    const user = await User.findOne({
      username,
    });
    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    };
    await User.create(userData);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const updateUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updateUserData);
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection.request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;
    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "to_user_id from_user_id"
      );
      const subject = "New Connection Request";
      const toUser: any = connection?.to_user_id as any;
      const fromUser: any = connection?.from_user_id as any;

      const body = `
      <div>
        <h2>Hi ${toUser?.full_name},</h2>
        <p>You have a new connection request from ${fromUser?.full_name} - @${fromUser?.username}.</p>
        <p>Click <a href="https://${process.env.FRONTEND_URL}/connections">here</a> to view your connection requests.</p>
        <br/>
        <p>Best regards,<br/>Ommah Team</p>
      </div>
      `;
      await sendEmail(toUser.email, subject, body);
    });
    const in24Hour = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hour);
    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "to_user_id from_user_id"
      );
      if (connection?.status === "accepted") {
        return { message: "Already accepted" };
      }
      const subject = "New Connection Request";
      const toUser: any = connection?.to_user_id as any;
      const fromUser: any = connection?.from_user_id as any;

      const body = `
      <div>
        <h2>Hi ${toUser?.full_name},</h2>
        <p>You have a new connection request from ${fromUser?.full_name} - @${fromUser?.username}.</p>
        <p>Click <a href="https://${process.env.FRONTEND_URL}/connections">here</a> to view your connection requests.</p>
        <br/>
        <p>Best regards,<br/>Ommah Team</p>
      </div>
      `;
      await sendEmail(toUser.email, subject, body);
      return { message: "Reminder sent" };
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  sendNewConnectionRequestReminder,
];
