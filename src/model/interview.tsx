import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";


export type InterviewParticpantsData = Database["public"]["Tables"]["interview_participants"]["Row"];
export type InterviewScheduleData = Database["public"]["Tables"]["interview_schedules"]["Row"];


export  async function createInterviewData(data: Partial<InterviewParticpantsData>) : Promise<Boolean> {
try {

    const {data: insertedData, error: insertError} = await supabase
        .from("interview_participants")
        .insert({
            name: data.name,
            email: data.email,
            user_id: data.user_id,
            schedule_id: data.schedule_id,
        }) // Pass the data object here
        .select("*")
        .single();

    if (insertError) {
        console.error("Supabase error creating interview data:", insertError);
        throw insertError;
    }
    if (!insertedData) {
        throw new Error("Failed to create interview data, no data returned.");
    }
    return true;
    
} catch (error) {
    console.error("Error creating interview data:", error);
    return false;
}

    
}