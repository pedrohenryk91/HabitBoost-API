import { createClient } from "@supabase/supabase-js";
import { PROJECT_KEY, PROJECT_LINK } from "./env";

export const supabase = createClient(PROJECT_LINK,PROJECT_KEY)