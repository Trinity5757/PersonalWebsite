
import { connectDB } from "@/app/lib/connectDB";
import { OrganizationRoles } from "@/app/models/enums/OrganizationRoles";
import { OrganizationType } from "@/app/models/enums/OrganizationType";
import { IMember, Member } from "@/app/models/Member";
import { addMember, getOrganizationMembers, removeMember, updateMember } from "@/app/services/memberService";
import mongoose from "mongoose";

// TODO: Run "npx jest --detectOpenHandles /tests/services/memberService.test.ts" to perform the tests
describe('Member Service Test', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  })

  const date = new Date();
  let memberId : string;

  const memberData = {
    userId: "6737d5f365eaffec4055d512",
    organization: "6753182c29e140ad3321db5b",
    organizationType: OrganizationType.TEAM,
    role: OrganizationRoles.PLAYER,
  };

  beforeEach(async () => {
    // Add test member to the database
    const member = new Member(memberData);
    const savedMember = await member.save();
    memberId = savedMember._id.toString();
  });

  afterEach(async () => {
    // Delete test member from the database
    if (memberId) {
      await Member.findByIdAndDelete(memberId).catch(error => { console.log(`Member with ID ${memberId} was already deleted:`, error.message)});
    }
  });
  
  test('Add memmber to organization', async () => {
    
    const result = await addMember(
      "6737d5f365eaffec4055d512",
      "6753182c29e140ad3321db5b",
      OrganizationType.TEAM,
      OrganizationRoles.PLAYER,
    );
      expect(memberData.userId).toEqual(result.userId.toString());
      expect(memberData.organization).toEqual(result.organization.toString());
      expect(memberData.organizationType).toEqual(result.organizationType);
      expect(memberData.role).toEqual(result.role);

      await removeMember(result._id.toString());
  });

  test('Update member roles', async () => {
    // Prepare new data
    const newData : Partial<IMember> = {
      role: OrganizationRoles.COACH
    }

    // Perform update
    const result = await updateMember(memberId, newData);

    // Check values match
    expect(result.userId.toString()).toEqual(memberData.userId);
    expect(result.organization.toString()).toEqual(memberData.organization);
    expect(result.organizationType).toEqual(memberData.organizationType);
    expect(result.role).toEqual(OrganizationRoles.COACH);

  });

  test('Get all members in organization', async () => {

    // Get list of members and validate the team 6753182c29e140ad3321db5b has 2 members
    const result = await getOrganizationMembers('6753182c29e140ad3321db5b');
    expect(result.length).toBe(1);

  });

  test('Remove memmber from organization', async () => {
    
    const result = await removeMember(memberId);
    expect(result).toBeDefined();

  });
});
