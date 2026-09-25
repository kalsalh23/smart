-- VIOLET Perfumes schema (idempotent)
create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null,
  category text not null,
  price numeric not null,
  old_price numeric,
  size text,
  description text,
  notes_top text,
  notes_heart text,
  notes_base text,
  image_url text,
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  note text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Admin gate: requests carrying header x-admin-key = ADMIN_PASS match is_admin()
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(current_setting('request.headers', true)::json ->> 'x-admin-key', '') = 'violet-admin-2026'
$$;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert" on public.products
  for insert with check (public.is_admin());

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update" on public.products
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert with check (true);

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read" on public.orders
  for select using (public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- Seed catalog (only inserts missing slugs)
insert into public.products
  (slug, name, brand, category, price, old_price, size, description, notes_top, notes_heart, notes_base, image_url, in_stock, featured)
values
  ('ysl-libre','يولي سان لوران ليبر','YSL','women',85,95,'90 مل','عطر الحرية الأيقوني بلمسة فرنسية جريئة، مزيج من اللافندر والبرتقال الفاتر مع فانيليا دافئة تدوم طويلاً.','برتقال ماندرين، لافندر','زهر البرتقال','فانيليا، مسك أبيض','/products/ysl-libre.svg',true,true),
  ('ysl-black-opium','يولي سان لوران بلاك أوبيم','YSL','women',80,null,'90 مل','عطر ليلي آسر من القهوة السوداء والفانيليا المطلية باللمعان، للمرأة الغامضة والجذابة.','قهوة سوداء، زهر الكمثرى','ياسمين أبيض','فانيليا، باتشولي','/products/ysl-black-opium.svg',true,true),
  ('ysl-l-homme','يولي سان لوران لوم','YSL','men',75,null,'100 مل','أناقة رجالية حديثة تجمع بين الحلو الفاتر والخشب الراقي، مناسب لكل الأوقات.','ليمون، جزر','زهر البرتقال، إكليل الجبل','خشب الأرز، تونكا','/products/ysl-l-homme.svg',true,false),
  ('dg-light-blue','دولتشي آند غابانا لايت بلو','D&G','women',70,null,'100 مل','نفحات صقلية منعشة كنسيم البحر الأبيض المتوسط، التفاح السيقلي والخيزران مع عنبر دافئ.','تفاح سيقلي، سيدر','خيزران، ياسمين','عنبر، مسك أبيض','/products/dg-light-blue.svg',true,false),
  ('dg-the-one','دولتشي آند غابانا ذا وان','D&G','women',78,85,'75 مل','عطر شرقي فاخر من الليتشي والياسمين مع فانيليا وعنبر، مثالي للمناسبات المسائية.','ليتشي، فواكه ناعمة','ياسمين، زنبق','فانيليا، عنبر، مسك','/products/dg-the-one.svg',true,false),
  ('dg-devotion','دولتشي آند غابانا ديفوشن','D&G','women',88,null,'50 مل','أحدث إصدارات D&G الفاخرة، كريمة الليمون الإيطالي مع فانيليا غنية في قارورة مذهّلة.','ليمون إيطالي','برتقال، لافندر','فانيليا، حليب اللوز','/products/dg-devotion.svg',true,true),
  ('narciso-for-her','نارسيسو رودريغيز فور هير','Narciso','women',72,null,'100 مل','أيقونة الأنوثة الهادئة، مسك ناعم مع ورد وياسمين في تركيبة نظيفة وأنيقة.','أوسمانتوس، فانيليا','مسك ناعم','فيتيفر، خشب الساج','/products/narciso-for-her.svg',true,false),
  ('narciso-poudree','نارسيسو بودريه','Narciso','women',75,null,'90 مل','عبير بودري فخم من الزهور البيضاء والمسك، نعومة تترك أثراً لا يُنسى.','زهور بيضاء','مسك بودري','خشب الكشمير، فيتيفر','/products/narciso-poudree.svg',true,false),
  ('givenchy-linterdit','جيفنشي لانترديت','Givenchy','women',82,90,'80 مل','عطر محرم بمعنى الكلمة: توبروز وياسمين داكنان على قاعدة فيتيفر وفانيليا جريئة.','برتقال، كمثرى','ياسمين، توبروز','فيتيفر، باتشولي، فانيليا','/products/givenchy-linterdit.svg',true,true),
  ('givenchy-gentleman','جيفنشي جينتلمان','Givenchy','men',70,null,'100 مل','رجولية كلاسيكية بروح عصرية، كمثرى وهيل مع إيريس وقرفة وخشب دافئ أنيق.','كمثرى، هيل','إيريس، قرفة','فانيليا، باتشولي','/products/givenchy-gentleman.svg',true,false),
  ('cavalli-paradiso-azzurro','روبرتو كافالي باراديسو أزورو','Roberto Cavalli','women',60,null,'75 مل','نسيم متوسطي ساحر من الياسمين والبرغموت مع خشب أبيض، كأنه إجازة على الشاطئ.','برغموت، ليمون','ياسمين، زهر البرتقال','خشب أبيض، مسك','/products/cavalli-paradiso-azzurro.svg',true,false),
  ('paco-olympia','باكو رابان أولمبيا','Paco Rabanne','women',85,95,'80 مل','عطر الإلهة اليونانية، مملحة وخشبية مع فانيليا كريمية، جرأة وأنوثة لا تُقاوم.','جريب فروت، كمثرى','ياسمين، زنبق الماء','فانيليا، مسك مملح','/products/paco-olympia.svg',true,true),
  ('paco-1-million','باكو رابان ون مليون','Paco Rabanne','men',75,null,'100 مل','الذهب السائل، قرفة وورد مع جلد وفانيليا، حضور لا يمرّ دون أثر.','برغموت، نعناع','قرفة، ورد','جلد، فانيليا، عود','/products/paco-1-million.svg',true,false),
  ('juicy-viva-la-juicy-set','طقم جوسي كوتور فيفا لا جوسي','Juicy Couture','gift',65,75,'100 مل + لوشن + 10 مل','طقم هدايا فاخر: عطر فيفا لا جوسي مع لوشن الجسم وحافظة جيب، هدية مثالية لكل مناسبة.','ويلد بيري، ماندرين','زهرة هونيسكل، جاردينيا','فانيليا، كراميل، براليه','/products/juicy-viva-la-juicy-set.svg',true,true),
  ('chanel-bleu','شانيل بلو دي شانيل','Chanel','men',110,null,'100 مل','أيقونة الرجال الفرنسية، حمضيات وخشب الصندل مع لبان ومسك، عميق وأنيق.','جريب فروت، نعناع','جوزة الطيب، فلفل','صندل، لبان، سيدر','/products/chanel-bleu.svg',true,true),
  ('chanel-coco-mademoiselle','شانيل كوكو مادموزيل','Chanel','women',115,null,'100 مل','جرأة كلاسيكية من البرتقال والورد الدمشقي مع باتشولي فخم، توقيع المرأة الراقية.','برتقال، برغموت','ورد دمشقي، ياسمين','باتشولي، فيتيفر','/products/chanel-coco-mademoiselle.svg',true,false),
  ('jpg-le-male','جان بول غوتييه لو مال','Jean Paul','men',70,null,'125 مل','الأسطورة الوردية، لافندر ونعناع مع فانيليا دافئة، عطر رجالي خالد منذ التسعينات.','نعناع، لافندر','قرفة، كمثرى','فانيليا، توباكو','/products/jpg-le-male.svg',true,false),
  ('elie-saab-le-parfum','إيلي صعب لو بارفان','Elie Saab','women',68,null,'90 مل','فخامة لبنانية عالية: زهر البرتقال مع ياسمين وورد، أناقة قادمة من منصات العرض.','زهر البرتقال','ياسمين، ورد','باتشولي، عنبر، مسك','/products/elie-saab-le-parfum.svg',true,false),
  ('versace-eros','فيرساتشي إيروس','Versace','men',72,null,'100 مل','عطر الحب والرغبة، نعناع وتفاح أخضر مع فانيليا وتونكا، حيوية وجاذبية.','نعناع، تفاح أخضر','بلسم النعناع، جيرانيوم','فانيليا، تونكا، سيدر','/products/versace-eros.svg',true,false),
  ('lancome-la-vie-est-belle','لانكوم لا في إي بيل','Lancôme','women',90,100,'100 مل','الحياة جميلة، إيريس وبراليات حلوة مع باتشولي، ابتسامة في قارورة كريستالية.','كشمش أسود، كمثرى','إيريس، ياسمين','براليه، باتشولي، تونكا','/products/lancome-la-vie-est-belle.svg',true,false),
  ('hugo-boss-bottled','هوغو بوس بوتلد','Hugo Boss','men',65,null,'100 مل','عطر الرجل الناجح، تفاح وقرفة مع صندل وفانيليا، كلاسيكي للمكتب والمناسبات.','تفاح، برغموت','قرفة، جيرانيوم','صندل، فيتيفر، فانيليا','/products/hugo-boss-bottled.svg',true,false),
  ('marc-jacobs-daisy','مارك جاكوبس ديزي','Marc Jacobs','women',70,null,'100 مل','انتعاش كرومي من البنفسج والفراولة مع خشب أبيض، شبابية وبهجة يومية.','بنفسج، فراولة','ياسمين، جاردينيا','خشب أبيض، مسك','/products/marc-jacobs-daisy.svg',true,false)
on conflict (slug) do nothing;
