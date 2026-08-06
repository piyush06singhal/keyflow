import { generateAppIcon } from "@/lib/generate-app-icon";

export function GET() {
  return generateAppIcon(512);
}
