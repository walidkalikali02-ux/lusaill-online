
create policy deny_direct_access on heatmap_private.settings for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on heatmap_private.views for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on heatmap_private.budgets for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on heatmap_private.activity for all to anon,authenticated using(false) with check(false);
