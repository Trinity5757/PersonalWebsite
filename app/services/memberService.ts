
import { OrganizationType } from "../models/enums/OrganizationType";
import { getTeamById } from "./teamService";
import { getBusinessById } from "./businessService";
import { ObjectId, Types } from "mongoose";
import { OrganizationRoles } from "../models/enums/OrganizationRoles";
import { connectDB } from "../lib/connectDB";
import { getUserById } from "./userService";
import { IMember, Member } from "../models/Member";

// Utility function
export async function verifyOrganization(organizationId: string, type: OrganizationType) {
  try {
    // Verify organizationID is valid
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new Error('Invalid organizationd ID format');
    }

    // Retrieve the object 
    if (type === OrganizationType.TEAM) {
      const team = await getTeamById(organizationId)
      return team;
    } else if (type === OrganizationType.BUSINESS) {
      const business = await getBusinessById(organizationId)
      return business;
    } else {
      throw new Error(`${type} is not a valid organization type`);
    }
  } catch (error) {
    throw error;
  }
}

export async function addMember(userId: string,
  organizationId: string,
  organizationType: OrganizationType,
  role: OrganizationRoles) {

  try {
    await connectDB();

    // Verify user and organization exists (Error would be thrown if they don't exist)
    await getUserById(userId)

    const organization = await verifyOrganization(organizationId, organizationType);

    // Verify member doesn't already exist in organization
    const memberExists = await getOrganizationMember(organizationId, userId);

    if (memberExists) {
      throw new Error(`The provided user is already a member of the ${organizationType}`);
    }

    // Once verified create the member object
    const member = new Member({
      userId,
      organization: organizationId,
      organizationType,
      role,
    });

    // Add Id of the member to the organization member array
    organization.members.push(member._id);
    await organization.save()

    await member.save();
    return member;

  } catch (error) {
    throw new Error(`Failed to add member to organization: ${error}`);
  }

}

export async function removeMember(memberId: string) {
  try {
    await connectDB();
    const deletedMember = await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
      throw new Error('member not found');
    }

    const organization = await verifyOrganization(deletedMember.organization.toString(), deletedMember.organizationType);

    organization.members = organization.members.filter((memberId: ObjectId) => memberId.toString() !== deletedMember._id.toString());
    await organization.save()

    return deletedMember;

  } catch (error) {
    throw new Error(`Failed to remove member from organization: ${error}`);
  }

}

export async function updateMember(memberId: string, memberData: Partial<IMember>) {
  try {
    await connectDB();

    const updatedMember = await Member.findByIdAndUpdate(memberId, memberData, { new: true });

    if (!updatedMember) {
      throw new Error('Failed to update role for provided member');
    }

    return updatedMember;
  } catch (error) {
    throw new Error(`Failed to update an organization members data: ${error}`);
  }
}

export async function getOrganizationMembers(organizationId: string) {
  try {
    await connectDB();

    const members = await Member.find({ organization: organizationId });

    return members;
  } catch (error) {
    throw new Error(`Failed to fetch all members for provided organization: ${error}`);
  }

}

export async function getOrganizationMember(organizationId: string, userId: string) {
  try {
    await connectDB();

    const member = await Member.find({ organization: organizationId, userId: userId });

    return member;
  } catch (error) {
    throw new Error(`Failed to fetch member with user ID, ${userId}, for provided organization: ${error}`);
  }

}