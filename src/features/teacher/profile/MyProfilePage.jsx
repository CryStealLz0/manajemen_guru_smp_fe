import React from 'react';
import Card from '../../../components/ui/Card';
import { Field, Row } from '../../../components/ui/Form';
import Pill from '../../../components/ui/Pill';

export default function MyProfilePage() {
    return (
        <Card title="Profil Singkat">
            <div className="grid">
                <Field label="Nama">
                    <input value="Pak Budi" disabled />
                </Field>

                <Row>
                    <Field label="NIP">
                        <input value="1980xxxx" disabled />
                    </Field>
                    <Field label="Status">
                        <input value="Active" disabled />
                    </Field>
                </Row>

                <div>
                    <label>Mapel yang Diampu</label>
                    <div className="row" style={{ gap: 8, marginTop: 6 }}>
                        <Pill>Matematika</Pill>
                        <Pill>Bahasa Indonesia</Pill>
                    </div>
                </div>
            </div>

            <div className="notice" style={{ marginTop: 10 }}>
                Butuh perubahan data? Hubungi Admin TU.
            </div>
        </Card>
    );
}
