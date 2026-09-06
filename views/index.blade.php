{{-- Obsidian Theme admin page (content partial; Blueprint wraps it in its own admin template) --}}
<div class="row">
    <div class="col-md-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">
                    <i class="fa fa-paint-brush"></i> Obsidian Theme
                    <span class="label label-success" style="margin-left:8px;">Active</span>
                </h3>
                <div class="box-tools pull-right">
                    <span class="label label-primary">v{{ isset($version) ? $version : '1.0.1' }}</span>
                </div>
            </div>
            <div class="box-body">
                <p>
                    The Obsidian premium dark theme is <strong>installed and active</strong> on your panel.
                    It restyles the entire interface — navigation, server console, resource widgets, charts,
                    file manager, tables and forms — with a unified design-token system.
                </p>
                <hr>

                {{-- Primary CTA --}}
                <div class="callout callout-info" style="margin-bottom:12px;">
                    <h4><i class="fa fa-palette"></i> Open the Theme Studio</h4>
                    <p>
                        The real-time visual editor runs inside the panel dashboard. From there you can switch
                        between the three prebuilt themes (Core / Slate / Aurora), reposition major UI elements,
                        and customize every color, spacing, radius, animation and more — with live preview.
                    </p>
                    <a href="{{ url('/account/customizer') }}" class="btn btn-flat btn-primary btn-lg" style="margin-top:8px;">
                        <i class="fa fa-paint-brush"></i> Open Theme Studio
                    </a>
                    <a href="{{ url('/account/customizer') }}" target="_blank" class="btn btn-flat btn-default" style="margin-top:8px;">
                        <i class="fa fa-external-link"></i> Open in New Tab
                    </a>
                </div>

                <p class="help-block">
                    Path: <code>/account/customizer</code> &mdash; available to administrators only.
                    Changes apply instantly per browser and require no rebuild.
                </p>

                <hr>

                {{-- Feature overview --}}
                <h4><i class="fa fa-star"></i> What's included</h4>
                <ul class="list-unstyled" style="margin-bottom:16px;">
                    <li style="padding:6px 0;"><i class="fa fa-check text-green"></i> <strong>3 prebuilt themes</strong> &mdash; Obsidian Core, Slate &amp; Aurora, each a complete design system.</li>
                    <li style="padding:6px 0;"><i class="fa fa-check text-green"></i> <strong>Live Theme Studio</strong> &mdash; visual editor with layout, colors, typography, spacing, radius, buttons, console, icons &amp; status colors.</li>
                    <li style="padding:6px 0;"><i class="fa fa-check text-green"></i> <strong>Everything customizable</strong> &mdash; export / import config, reset, undo / redo.</li>
                    <li style="padding:6px 0;"><i class="fa fa-check text-green"></i> <strong>Fully responsive</strong> &mdash; from 320px phones to 8K ultrawide, with device-aware layouts.</li>
                    <li style="padding:6px 0;"><i class="fa fa-check text-green"></i> <strong>Respects Pterodactyl</strong> &mdash; all server, file, database, network &amp; console functionality is preserved.</li>
                </ul>

                <hr>

                <h4><i class="fa fa-info-circle"></i> Quick actions</h4>
                <div class="btn-group" style="margin-bottom:8px;">
                    <button type="button" class="btn btn-flat btn-default" onclick="window.open('{{ url('/account/customizer') }}','_blank');">
                        <i class="fa fa-eye"></i> Launch Customizer
                    </button>
                    <button type="button" class="btn btn-flat btn-default" onclick="window.location.href='{{ url('/account') }}';">
                        <i class="fa fa-user"></i> Account Settings
                    </button>
                </div>

                <p class="help-block" style="margin-top:12px;">
                    Theme by <strong>paradox6ygf</strong> &middot; Obsidian HQ &middot; support via the project Discord.
                </p>
            </div>
        </div>
    </div>
</div>