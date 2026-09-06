@extends('layouts.admin')
@section('title', 'Obsidian Theme')

@section('content-header')
    <h1>Obsidian Theme <small>Premium dark theme settings.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Obsidian Theme</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Obsidian Theme — Active</h3>
            </div>
            <div class="box-body">
                <p>The Obsidian premium dark theme is currently <strong>installed and active</strong>.</p>
                <p>Theme version: <code>1.0.0</code> by <strong>paradox6ygf</strong></p>
            </div>
        </div>
    </div>
</div>
@endsection
