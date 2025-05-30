// app/services/inviteService.ts

import mongoose, { startSession, Types } from "mongoose";
import { InviteType } from "../models/enums/InviteType";
import { getBusinessById } from "./businessService";
import { getTeamById } from "./teamService";
import { getEventById } from "./eventService";
import { OrganizationRoles } from "../models/enums/OrganizationRoles";
import { InviteStatus } from "../models/enums/InviteStatus";
import { Invite } from "../models/Invites";
import { OrganizationType } from "../models/enums/OrganizationType";
import { addMember } from "./memberService";
import { Event } from "../models/Event";
import { connectDB } from "../lib/connectDB";

interface Invitee {
  inviteeId: string;
  inviteeType: string;
  role?: OrganizationRoles 
  status: InviteStatus;
  expirationDate: Date;
  declinedAt: Date;
}

interface AssociatedEntity {
  associatedEntityId: string;
  associatedEntityType: InviteType;
}

interface InviteStatusChange {
  inviteeId: string;
  accepted: boolean;
}

interface ChangeInviteeRoles {
  inviteeId: string;
  role: OrganizationRoles;
}

interface Updates {
  editorId: string;
  title?: string;
  message?: string;
  inviteStatusChange?: InviteStatusChange;
  changeInviteeRoles?: ChangeInviteeRoles[];
  inviteesToAdd?: Invitee[];
  inviteesToRemove?: string[];
}

interface QueryUpdateParams {
  title?: string;
  message?: string;
  $push?: { invitees?: { $each: Invitee[] } };
  $pull?: { invitees?: { inviteeId: { $in: mongoose.Types.ObjectId[] } } };
}

// Utility Functions
export async function changeInviteStatus(inviteId: string, statusChange: InviteStatusChange, entityId: string, entityType: InviteType) {

  try {
    await connectDB();

    let updateResults;

    // Retrieve info for invitee who's status will change
    const invite = await Invite.findById({ _id: inviteId});
    if(!invite) {
      throw new Error('Invite does not exist with specified ID');
    }

    const invitee = invite.invitees.find((invitee: Invitee) => invitee.inviteeId.toString() === statusChange.inviteeId);
    if(!invitee) {
      throw new Error('Specified invitee does not exist');
    }


    let status = InviteStatus.ACCEPTED;
    let dateField = "acceptedDate";

    // Check the invitee does not confirm invite on an expired invite
    if(invitee.expirationDate !== null) {
      const currentDate = new Date();
      if(currentDate > invitee.expirationDate) {
        status = InviteStatus.EXPIRED;
      }
    }

    

    // Change invitee info in the initees array in invite entity
    if(status !== InviteStatus.EXPIRED) {
      if(!statusChange.accepted) {
        status = InviteStatus.DECLINED;
        dateField = "declinedDate"
      }
      updateResults = await Invite.findOneAndUpdate(
        { _id: inviteId, 'invitees.inviteeId': statusChange.inviteeId},
        { $set: { [`invitees.$.${dateField}`]: new Date(), [`invitees.$.status`]: status } },
        { new: true }
      );
    } else {
      updateResults = await Invite.findOneAndUpdate(
        { _id: inviteId, 'invitees.inviteeId': statusChange.inviteeId},
        { $set: { [`invitees.$.status`]: InviteStatus.EXPIRED } },
        { new: true }
      );
    }
    
    if(status === InviteStatus.ACCEPTED) {
      // Add to respective entity (organization, events, etc.)
      if(Object.values(OrganizationType).includes(entityType as unknown as OrganizationType)) {
        
        await addMember(
          statusChange.inviteeId, 
          entityId, 
          entityType as unknown as OrganizationType, 
          invitee.role
        );
        
      } else if(entityType === InviteType.EVENT) {
        
        if(invitee.inviteeType === 'User') {
          // Verify user isn't already a participant in the event
          const participantExists = await Event.find( {_id: entityId, 'participants.user': statusChange.inviteeId} );
          if(participantExists.length > 0) {
            throw new Error('User is already in the participants list for specified event');
          }
          
          await Event.findOneAndUpdate(
            { _id: entityId },
            { $addToSet: { participants: { user: statusChange.inviteeId } }}
          );
          
        } else if(invitee.inviteeType === 'Team') {
          // Verify team isn't already a participant in the event
          const participantExists = await Event.find( {_id: entityId, 'participants.team': statusChange.inviteeId} );
          if(participantExists.length > 0) {
            throw new Error('Team is already in the participants list for specified event');
          }
          
          const team = await getTeamById(statusChange.inviteeId);
          
          await Event.findOneAndUpdate(
            { _id: entityId },
            { $addToSet: { participants: { user: team.owner, team: team._id}}}
          );
        }
          // TODO: Else if's for Library and Sports
        }
      }
      return updateResults;
      
    } catch (error) {
      throw new Error(`Failed to change invite status: ${error}`);
  }

}

export async function verifyInviterIsAdmin(inviter: string, associatedEntityId: string, associatedEntityType: InviteType) {

  // TODO: Add sport create_by verification once service function is 
  // TODO: Add library owner verification once model is made
  await connectDB();

  if(associatedEntityType === InviteType.BUSINESS) {
    const business = await getBusinessById(associatedEntityId);
    if (!business) {
      throw new Error(`Business with id, ${associatedEntityId}, does not exist`);
    }
    return business.owner.toString() === inviter;

  } else if(associatedEntityType === InviteType.TEAM) {
    const team = await getTeamById(associatedEntityId);
    if (!team) {
      throw new Error(`Team with id, ${associatedEntityId}, does not exist`);
    }
    return team.owner.toString() === inviter;
  } 
  else if(associatedEntityType === InviteType.EVENT) {
    const event = await getEventById(associatedEntityId);
    if (!event) {
      throw new Error(`Event with id, ${associatedEntityId}, does not exist`);
    }
    return event.organizer.toString() === inviter;
  }
  else {
    throw new Error(`Invites can't be generated for entity of type ${associatedEntityType}`);
  }
}

export async function createInvite(inviter: string, associatedEntity: AssociatedEntity, invitees: Invitee[], title: string, message: string) {
  try {
    await connectDB();

    if(!Types.ObjectId.isValid(inviter)) {
      throw new Error("Invalid inviter ID format");
    }

    if(!Types.ObjectId.isValid(associatedEntity.associatedEntityId)) {
      throw new Error(`Invalid ${associatedEntity.associatedEntityType} ID format`);
    }

    const verifiedAdmin = await verifyInviterIsAdmin(inviter, associatedEntity.associatedEntityId, associatedEntity.associatedEntityType);
    if(!verifiedAdmin) {
      throw new Error(`The inviter has no authority to make any invites for the specified ${associatedEntity.associatedEntityType}`);
    }

    const invite = new Invite({
      associatedEntity,
      inviter,
      invitees,
      title,
      message
    });

    await invite.save();

    // TODO: Create and send notifications for invitees 

    return invite;
  } catch (error) {
    throw new Error(`Failed to generate an invite for the specified ${associatedEntity.associatedEntityType}: ${error}`);
  }
}

export async function deleteInvite(inviteId: string) {
  try {    
    
    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('Invalid invite ID format');
    }

    await connectDB();

    const deletedInvite = await Invite.findByIdAndDelete(inviteId);

    if(!deletedInvite) {
      throw new Error(`Invite with ID ${inviteId} was not found`);
    }
    return deletedInvite;

  } catch (error) {
    throw new Error(`Failed to delete invite: ${error}`);
  }
}

export async function deleteEntitiesInvites(entityId: string) {
  try {
    if(!Types.ObjectId.isValid(entityId)) {
      throw new Error('Invalid invite ID format');
    }
    
    await connectDB();  

    const deletedInvites = await Invite.deleteMany({ 'associatedEntity.associatedEntityId': entityId });

    if(!deletedInvites) {
      throw new Error(`Entity with ID ${entityId} does not have any invites`);
    }
    return deletedInvites;

  } catch (error) {
    throw new Error(`Failed to delete invite: ${error}`);
  }
}

export async function getInvitesById(inviteId: string) {

  try {
    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('Invalid invite ID format');
    }
    
    await connectDB();

    const invite = await Invite.findById({ _id: inviteId });

    if(!invite) {
      throw new Error(`No invite with id, ${inviteId} was found`);
    }

    return invite
  } catch (error) {
    throw new Error(`Failed to retrieve invite: ${error}`);
  }
}

export async function getInvitesByEntity(entityId: string) {

  try {
    if(!Types.ObjectId.isValid(entityId)) {
      throw new Error('Invalid entity ID format');
    }

    await connectDB();

    const entitiesInvites = await Invite.find( { 'associatedEntity.associatedEntityId': entityId});

    if(!entitiesInvites) {
      throw new Error('No invites for specified entity have been created');
    }

    return entitiesInvites
  } catch (error) {
    throw new Error(`Failed to retrieve invites associated with the specified entitiy: ${error}`);
  }

}

export async function updateInvite(inviteId: string, editorId: string, updates: Partial<Updates>) {
  const session = await startSession();
  session.startTransaction();

  try {
    let updateResults;

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('Invalid invite ID format');
    }
    
    const invite = await getInvitesById(inviteId);
    
    if(updates.inviteStatusChange) {
      updateResults = await changeInviteStatus(invite._id, updates.inviteStatusChange, invite.associatedEntity.associatedEntityId, invite.associatedEntity.associatedEntityType);
      console.log(updateResults);
    } else {
      // Verify if the user is the expected editor
      if(!Types.ObjectId.isValid(editorId!)) {
        throw new Error('Invalid user ID format');
      }
      if(invite.inviter.toString() !== editorId) {
        throw new Error(`The current editor is not allowed to edit the invite. Only the inviter`);
      } 
    }
    
    const changes: QueryUpdateParams = {};

    if(updates.title) {
      changes.title = updates.title;
    }

    if(updates.message) {
      changes.message = updates.message;
    }
    
    if(updates.inviteesToAdd) {
      changes.$push = { invitees: { $each: updates.inviteesToAdd } };
    }
    
    if(updates.inviteesToRemove) {
      const inviteeIdsToRemove = updates.inviteesToRemove.map((id: string) => new mongoose.Types.ObjectId(id));
      changes.$pull = { invitees: { inviteeId: { $in: inviteeIdsToRemove } } };
    }
    
    if(updates.changeInviteeRoles) {
      for(const inviteeChanges of updates.changeInviteeRoles) {
        if(Object.values(OrganizationRoles).includes(inviteeChanges.role)) {
          updateResults = await Invite.findOneAndUpdate(
            { _id: invite._id, 'invitees.inviteeId': inviteeChanges.inviteeId},
            { $set: { 'invitees.$.role': inviteeChanges.role} },
            { new: true, session }
          );
        } else {
          throw new Error(`${inviteeChanges.role} is not a valid organization role`);
        }
      }
    }

    if(Object.keys(changes).length > 0) {
      const updatedInvite = await Invite.findByIdAndUpdate(
        { _id: inviteId },
        changes,
        { new: true, session}
      );
      if(!updatedInvite) {
        throw new Error(`No invite was found with ID: ${inviteId}`);
      }
      
      updateResults = updatedInvite;
    }

    await session.commitTransaction();
    session.endSession();
    
    return updateResults;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error(`Failed to update invite with ID, ${inviteId}: ${error}`);
  }
}
