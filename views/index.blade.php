{{-- Obsidian Theme admin page (content partial; Blueprint wraps it in its own admin template) --}}
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Obsidian Theme &mdash; Active</h3>
            </div>
            <div class="box-body">
                <p>The Obsidian dark theme is currently <strong>installed and active</strong>.</p>
                <p>Theme version: <code>1.0.1</code> by <strong>paradox6ygf</strong></p>
                <hr>
                <h4>Customizing the theme</h4>
                <p>
                    Open the live theme customizer in the dashboard at
                    <a href="{{ url('/account/customizer') }}">Dashboard &rarr; Account &rarr; Obsidian Theme</a>
                    &mdash; direct path: <code>/account/customizer</code>.
                </p>
                <p class="help-block">
                    The customizer is available to administrators only. Changes (colors, radius,
                    animations, density, light/dark) apply instantly per browser and require no rebuild.
                </p>
            </div>
        </div>
    </div>
</div>