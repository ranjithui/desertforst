// Lucide icons referenced by name from the CMS data (stats, values, strengths).
import {
  Award, BookOpen, CheckCircle, Factory, Globe, Heart, HeartHandshake, Lightbulb,
  Shield, ShieldCheck, Smile, Sparkles, Store, Users,
} from 'lucide-react';

const ICONS = { Award, BookOpen, CheckCircle, Factory, Globe, Heart, HeartHandshake, Lightbulb, Shield, ShieldCheck, Smile, Sparkles, Store, Users };

export const iconFor = name => ICONS[name] || Award;
